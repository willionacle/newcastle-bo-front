import i18next from "@/i18n/i18n";
import { useSearchUsernames, SearchUsernamesParams } from "@/api/users/search-usernames";
import { useDebounce } from "@/hooks/useDebounce";
import { Form, Select, SelectProps, Checkbox, Button } from "antd";
import { useEffect, useMemo, useState, useRef } from "react";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { useTranslation } from "react-i18next";

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
  size?: SizeType;
  userLevels?: number[]; // Filter by user levels
  userGrades?: number[]; // Filter by user grades
  showLevelInfo?: boolean; // Show level and grade info in options
}

const SearchableUserSelect = ({
  label,
  required,
  mode,
  withCheckbox,
  name = ["username"],
  initialValue,
  valueCode = "username", // Default to username
  size,
  userLevels,
  userGrades,
  showLevelInfo = false
}: Props) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>("");
  const [immediateSearch, setImmediateSearch] = useState<string>("");
  const searchInputRef = useRef<string>("");

  // Use debounce for automatic search while typing
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Use immediate search when user presses Enter or clicks search button
  const finalSearchTerm = immediateSearch || debouncedSearchValue;

  // Build search parameters
  const searchParams: SearchUsernamesParams = useMemo(() => ({
    username: finalSearchTerm || null,
    user_level: userLevels?.length ? userLevels : null,
    user_grade: userGrades?.length ? userGrades : null,
  }), [finalSearchTerm, userLevels, userGrades]);

  const {
    data,
    isLoading,
  } = useSearchUsernames(searchParams);

  const options: SelectProps["options"] = useMemo(
    () =>
      data?.map((item) => {
        // Build label with optional level/grade info
        const label = showLevelInfo
          ? `${item.username} (Lv.${item.userLevel} / G.${item.userGrade})`
          : item.username;

        // Determine value based on valueCode
        let value: any;
        if (valueCode === "username") {
          value = item.username;
        } else if (valueCode === "userLevel") {
          value = item.userLevel;
        } else if (valueCode === "userGrade") {
          value = item.userGrade;
        } else {
          value = item[valueCode as keyof typeof item] ?? item.username;
        }

        return { label, value };
      }) ?? [],
    [data, valueCode, showLevelInfo]
  );

  const form = Form.useFormInstance();
  const watched = Form.useWatch(name) as any;

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

  const allValues = useMemo(() => options.map((o: any) => o.value), [options]);
  const isAllSelected =
    allValues.length > 0 && allValues.every((v) => selectedSet.has(v));

  const setAll = () =>
    form.setFieldValue(
      name,
      options.map((o: any) => ({ value: o.value, label: o.label }))
    );
  const clearAll = () => form.setFieldValue(name, []);

  useEffect(() => {
    if (initialValue === undefined || !options.length) return;

    const toLV = (v: any) => {
      if (v && typeof v === "object" && "value" in v) {
        const opt = options.find((o: any) => o.value === v.value);
        return { value: v.value, label: v.label ?? opt?.label ?? v.value };
      }
      const opt = options.find((o: any) => o.value === v);
      return { value: v, label: opt?.label ?? v };
    };

    if (mode === "multiple") {
      const arr = Array.isArray(initialValue) ? initialValue : [initialValue];
      form.setFieldValue(name, arr.map(toLV));
    } else {
      form.setFieldValue(name, toLV(initialValue));
    }
  }, [initialValue, options, mode, form, name]);

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
        disabled={options.length === 0}
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

  const handleSearch = (value: string) => {
    searchInputRef.current = value;
    setSearchValue(value);
    // Reset immediate search when user types
    if (immediateSearch) {
      setImmediateSearch("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Trigger immediate search on Enter
      setImmediateSearch(searchInputRef.current);
    }
  };

  return (
    <Form.Item name={name} rules={[{ required }]} label={label}>
      <Select
        labelInValue
        showSearch
        mode={mode}
        notFoundContent={isLoading ? i18next.t("text.loading") : (searchInputRef.current ? i18next.t("text.noResults") : i18next.t("text.enterSearchTerm"))}
        options={options}
        loading={isLoading}
        filterOption={false} // Disable client-side filtering since we use server-side search
        onSearch={handleSearch}
        searchValue={searchInputRef.current}
        onInputKeyDown={handleSearchKeyDown}
        allowClear
        size={size}
        placeholder={i18next.t("text.searchUsername")}
        {...checkboxProps}
      />
    </Form.Item>
  );
};

export default SearchableUserSelect;