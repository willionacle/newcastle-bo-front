import i18next from "@/i18n/i18n";
import { agentAPI } from "@/api/agent/get";
import { Form, Select, SelectProps, Checkbox, Button } from "antd";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

type LV = { value: any; label?: any };
type Init = string | number | LV | Array<string | number | LV>;

interface Props {
  label?: string;
  required?: boolean;
  mode?: SelectProps["mode"];
  size?: SelectProps["size"];
  withCheckbox?: boolean;
  name?: string;
  initialValue?: Init;
  optionValue?: string;  
  optionLabel?: string; 
}

const toKey = (v: any) => String(v);

const AgentSelect = ({
  label,
  required,
  mode,
  withCheckbox,
  name = "agent_id",
  initialValue,
  optionValue = "id",
  optionLabel = "username",
  size,
}: Props) => {
  const { t } = useTranslation();
  const {
    swr: { data, isLoading },
  } = agentAPI();

  const options: SelectProps["options"] = useMemo(
    () =>
      data?.data?.map((item: any) => ({
        label: item?.[optionLabel],
        value: toKey(item?.[optionValue]),
      })) ?? [],
    [data, optionValue, optionLabel]
  );

  const form = Form.useFormInstance();
  const watched = Form.useWatch(name) as any;

  const selectedSet = useMemo(() => {
    if (mode === "multiple") {
      const arr = watched ?? [];
      return new Set(
        arr.map((x: any) =>
          toKey(x && typeof x === "object" && "value" in x ? x.value : x)
        )
      );
    }
    const v = watched;
    const k = v && typeof v === "object" && "value" in v ? v.value : v;
    return new Set(k == null ? [] : [toKey(k)]);
  }, [watched, mode]);

  const allValues = useMemo(
    () => (options ?? []).map((o: any) => toKey(o.value)),
    [options]
  );

  const isAllSelected =
    allValues.length > 0 && allValues.every((v) => selectedSet.has(v));

  const setAll = () =>
    form.setFieldValue(
      name,
      (options ?? []).map((o: any) => ({ value: o.value, label: o.label }))
    );

  const clearAll = () => form.setFieldValue(name, []);

  useEffect(() => {
    if (initialValue === undefined || !(options && options.length)) return;

    const toLV = (v: any): LV => {
      if (v && typeof v === "object" && "value" in v) {
        const key = toKey(v.value);
        const opt = (options as any[]).find((o) => toKey(o.value) === key);
        return { value: key, label: v.label ?? opt?.label ?? key };
      }
      const key = toKey(v);
      let opt = (options as any[]).find((o) => toKey(o.value) === key);
      if (!opt) opt = (options as any[]).find((o) => toKey(o.label) === key); // allow username match
      return { value: opt?.value ?? key, label: opt?.label ?? key };
    };

    if (mode === "multiple") {
      const arr = Array.isArray(initialValue) ? initialValue : [initialValue];
      form.setFieldValue(name, arr.map(toLV));
    } else {
      form.setFieldValue(name, toLV(initialValue));
    }
  }, [initialValue, options, mode, form, name]);

  const header =
    withCheckbox && mode === "multiple" ? (
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
          disabled={(options ?? []).length === 0}
        >
          {isAllSelected ? t("global.deselectAll") : t("global.selectAll")}
        </Button>
        <Button size="small" onClick={clearAll} disabled={selectedSet.size === 0}>
          {t("global.clearSelection")}
        </Button>
      </div>
    ) : null;

  const checkboxProps =
    withCheckbox && mode === "multiple"
      ? {
          menuItemSelectedIcon: () => null,
          optionRender: (opt: any) => {
            const checked = selectedSet.has(toKey(opt.value));
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
    <Form.Item name={[name]} rules={[{ required }]} label={label}>
      <Select
        labelInValue
        showSearch
        mode={mode}
        notFoundContent={i18next.t("text.searchThenEnter")}
        options={options}
        loading={isLoading}
        optionFilterProp="label"
        filterOption
        allowClear
        size={size}
        {...checkboxProps}
      />
    </Form.Item>
  );
};

export default AgentSelect;
