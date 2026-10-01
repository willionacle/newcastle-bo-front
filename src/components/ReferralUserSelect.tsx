import i18next from "@/i18n/i18n";
import { useSearchUsernames, SearchUsernamesParams } from "@/api/users/search-usernames";
import { useDebounce } from "@/hooks/useDebounce";
import { Form, Select, SelectProps } from "antd";
import { useEffect, useMemo, useState, useRef } from "react";
import { SizeType } from "antd/lib/config-provider/SizeContext";

interface InitLV { value: any; label?: any }
type Init = string | number | InitLV;

interface Props {
  label?: string;
  required?: boolean;
  name?: string;
  initialValue?: Init;
  size?: SizeType;
  placeholder?: string;
}

const ReferralUserSelect = ({
  label,
  required,
  name = "referral_username",
  initialValue,
  size,
  placeholder = i18next.t("text.searchReferrer")
}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [immediateSearch, setImmediateSearch] = useState<string>("");
  const searchInputRef = useRef<string>("");

  // Use debounce for automatic search while typing
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Use immediate search when user presses Enter
  const finalSearchTerm = immediateSearch || debouncedSearchValue;

  // Build search parameters
  const searchParams: SearchUsernamesParams = useMemo(() => ({
    username: finalSearchTerm || null,
    user_level: null,
    user_grade: null,
  }), [finalSearchTerm]);

  const {
    data,
    isLoading,
  } = useSearchUsernames(searchParams);

  const options: SelectProps["options"] = useMemo(
    () =>
      data?.map((item) => ({
        label: item.username,
        value: item.username,
      })) ?? [],
    [data]
  );

  const form = Form.useFormInstance();

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

    form.setFieldValue(name, toLV(initialValue));
  }, [initialValue, options, form, name]);

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
        notFoundContent={isLoading ? i18next.t("text.loading") : (searchInputRef.current ? i18next.t("text.noResults") : i18next.t("text.enterSearchTerm"))}
        options={options}
        loading={isLoading}
        filterOption={false} // Disable client-side filtering since we use server-side search
        onSearch={handleSearch}
        onInputKeyDown={handleSearchKeyDown}
        allowClear
        size={size}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};

export default ReferralUserSelect;
