import i18next from "@/i18n/i18n";
import { levelConfingAPI } from "@/api/level-configs/get";
import { Form, Select, SelectProps, Checkbox, Button } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SizeType } from "antd/lib/config-provider/SizeContext";
interface Props {
  required?: boolean;
  label?: React.ReactNode;
  all?: boolean;
  mode?: SelectProps["mode"];
  withCheckbox?: boolean;
  size?: SizeType;
  name?: string;
}

const LevelSelector = ({
  required = false,
  label,
  all = false,
  mode,
  withCheckbox,
  size,
  name = "level",
}: Props) => {
  const { t } = useTranslation();

  const { swr } = levelConfingAPI({
    page: 1,
    limit: 9999,
    orderby: "asc",
    columnby: "id",
  });

  const baseOptions: SelectProps["options"] = useMemo(() => {
    try {
      return (
        swr?.data?.data?.map((item: { level: any }) => ({
          label: item.level,
          value: item.level,
        })) ?? []
      );
    } catch {
      return [];
    }
  }, [swr]);

  const options: SelectProps["options"] = useMemo(() => {
    if (all && mode !== "multiple") {
      return [{ label: i18next.t("col.all"), value: 9999 }, ...(baseOptions ?? [])];
    }
    return baseOptions ?? [];
  }, [all, mode, baseOptions]);

  const form = Form.useFormInstance();
  const watched = Form.useWatch("level") as any;

  const selectedSet = useMemo(() => {
    if (mode === "multiple") {
      const arr = watched ?? [];
      return new Set(
        arr.map((x: any) => (x && typeof x === "object" ? x.value : x))
      );
    }
    const v = watched;
    return new Set(v == null ? [] : [typeof v === "object" ? v.value : v]);
  }, [watched, mode]);

  const bulkOptions = useMemo(
    () => (options ?? []).filter((o: any) => o?.value !== 9999),
    [options]
  );
  const allValues = useMemo(
    () => bulkOptions.map((o: any) => o.value),
    [bulkOptions]
  );
  const isAllSelected =
    allValues.length > 0 && allValues.every((v) => selectedSet.has(v));

  const setAll = () => form.setFieldValue("level", allValues);
  const clearAll = () => form.setFieldValue("level", []);

  const header = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap:"10px",
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

  const labelNode =
    typeof label === "undefined" || label === false
      ? t("depositBonusDetail.dbe007")
      : label;

  return (
    <Form.Item name={name} label={labelNode} rules={[{ required }]}>
      <Select
        showSearch
        mode={mode}
        options={options}
        loading={swr?.isLoading}
        optionFilterProp="label"
        filterOption
        allowClear
         size={size}
        {...checkboxProps}
      />
    </Form.Item>
  );
};

export default LevelSelector;
