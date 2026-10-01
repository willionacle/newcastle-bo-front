import i18next from "@/i18n/i18n";
import { Select, SelectProps, Checkbox, Button } from "antd";
import { useMemo } from "react";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { useTranslation } from "react-i18next";

interface Props {
  value?: any[];
  onChange?: (value: any[]) => void;
  all?: boolean;
  mode?: SelectProps["mode"];
  withCheckbox?: boolean;
  size?: SizeType;
  disabled?: boolean;
}

const GRADE_OPTIONS = [
  { label: i18next.t("grade.bronze"), value: 1 },
  { label: i18next.t("grade.silver"), value: 2 },
  { label: i18next.t("grade.gold"), value: 3 },
  { label: i18next.t("grade.emerald"), value: 4 },
  { label: i18next.t("grade.ruby"), value: 5 },
  { label: i18next.t("grade.diamond"), value: 6 },
  { label: i18next.t("grade.blackDiamond"), value: 7 },
];

const GradeSelectorV2 = ({
  value,
  onChange,
  all = false,
  mode,
  withCheckbox,
  size,
  disabled = false,
}: Props) => {
  const { t } = useTranslation();
  const options: SelectProps["options"] = useMemo(() => {
    if (all && mode !== "multiple") {
      return [{ label: i18next.t("col.all"), value: 0 }, ...GRADE_OPTIONS];
    }
    return GRADE_OPTIONS;
  }, [all, mode]);

  const selectedSet = useMemo(() => {
    if (mode === "multiple") {
      const arr = value ?? [];
      return new Set(
        arr.map((x: any) => (x && typeof x === "object" ? x.value : x))
      );
    }
    const v = value?.[0];
    return new Set(v == null ? [] : [typeof v === "object" ? v.value : v]);
  }, [value, mode]);

  const bulkOptions = useMemo(
    () => (options ?? []).filter((o: any) => o?.value !== 0),
    [options]
  );

  const allValues = useMemo(
    () => bulkOptions.map((o: any) => o.value),
    [bulkOptions]
  );

  const isAllSelected =
    allValues.length > 0 && allValues.every((v) => selectedSet.has(v));

  const setAll = () => onChange?.(allValues);
  const clearAll = () => onChange?.([]);

  const header = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: 8,
        borderBottom: "1px solid #f0f0f0",
      }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        size="small"
        onClick={() => (isAllSelected ? clearAll() : setAll())}
        disabled={bulkOptions.length === 0}
      >
        {t("global.selectAll")}
      </Button>
      <Button
        size="small"
        onClick={clearAll}
        disabled={selectedSet.size === 0}
      >
        {t("global.clearSelection")}
      </Button>
    </div>
  );

  const checkboxProps =
    withCheckbox && mode === "multiple"
      ? {
          menuItemSelectedIcon: () => null,
          optionRender: (opt: any) => {
            const checked = selectedSet.has(opt.value);
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Checkbox checked={checked} style={{ pointerEvents: "none" }} />
                <span>{opt.label}</span>
              </div>
            );
          },
          dropdownRender: (menu: React.ReactNode) => (
            <div>
              {header}
              {menu}
            </div>
          ),
        }
      : {};

  return (
    <Select
      value={value}
      onChange={onChange}
      showSearch
      mode={mode}
      options={options}
      optionFilterProp="label"
      filterOption
      allowClear
      size={size}
      disabled={disabled}
      {...checkboxProps}
    />
  );
};

export default GradeSelectorV2;
