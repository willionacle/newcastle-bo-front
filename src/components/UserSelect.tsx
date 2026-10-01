import i18next from "@/i18n/i18n";
import { userAPIStateQuery } from "@/api/users/get";
import { Form, Select, SelectProps, Checkbox, Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import useDebounce from "@/hooks/useDebounce";

interface InitLV { value: any; label?: any }
type Init = string | number | InitLV | Array<string | number | InitLV>;

interface Props {
  label?: string;
  required?: boolean;
  mode?: SelectProps["mode"];
  withCheckbox?: boolean;
  name?: (string | number)[];
  initialValue?: Init;        
  valueCode?: string;
  size?:SizeType;
}

const UserSelect = ({
  label,
  required,
  mode,
  withCheckbox,
  name = ["username"],
  initialValue,
  valueCode = "id",
  size
}: Props) => {
  const { t } = useTranslation();
  const {
    swr: { data, isLoading }, setFilters
  } = userAPIStateQuery({
    page: 1,
    limit: 20,
    orderby: "DESC",
    columnby: "created_at",
    status: null,
    username: null,
    referral_username: null,
    agent_username: null,
    user_real_name: null,
    user_level: null,
    start_date: null,
    end_date: null,
  });

  const options: SelectProps["options"] = useMemo(
    () =>
      data?.data?.items?.map((item: any) => ({
        label: item.username,
        value: item[valueCode],
      })) ?? [],
    [data, valueCode]
  );

  const form = Form.useFormInstance();
  const watched = Form.useWatch(name) as any;
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  const selectedSet = useMemo(() => {
    if (mode === "multiple") {
      const arr = watched ?? [];
      return new Set(
        arr.map((x: any) => (x && typeof x === "object" && "value" in x ? x.value : x))
      );
    }
    const v = watched;
    const val = v && typeof v === "object" && "value" in v ? v.value : v;
    return new Set(val == null ? [] : [val]);
  }, [watched, mode]);

  const allValues = useMemo(() => options?.map((o: any) => o.value) ?? [], [options]);
  const isAllSelected =
    allValues.length > 0 && allValues.every((v) => selectedSet.has(v));

  const setAll = () =>
    form.setFieldValue(
      name,
      options?.map((o: any) => ({ value: o.value, label: o.label })) ?? []
    );
  const clearAll = () => form.setFieldValue(name, []);

  // Searh username
  const onSearch = (val: string) => {
    setSearchValue(val);
  };

  useEffect(() => {
    if (initialValue === undefined || !options?.length) return;

    const toLV = (v: any) => {
      if (v && typeof v === "object" && "value" in v) {
        const opt = options?.find((o: any) => o.value === v.value);
        return { value: v.value, label: v.label ?? opt?.label ?? v.value };
      }
      const opt = options?.find((o: any) => o.value === v);
      return { value: v, label: opt?.label ?? v };
    };

    if (mode === "multiple") {
      const arr = Array.isArray(initialValue) ? initialValue : [initialValue];
      form.setFieldValue(name, arr.map(toLV));
    } else {
      form.setFieldValue(name, toLV(initialValue));
    }
  }, [initialValue, options, mode, form, name]);

  // debounce searchValue state,
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      username: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

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
        disabled={!options || options.length === 0}
      >
        {t("global.selectAll")}
      </Button>
      <Button size="small" onClick={clearAll} disabled={selectedSet.size === 0}>
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
    <Form.Item name={name} rules={[{ required }]} label={label}>
      <Select
        labelInValue
        showSearch
        onSearch={onSearch}
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

export default UserSelect;
