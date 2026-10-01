import { ResUser } from "@/api/types";
import { Form, Select, SelectProps, Checkbox, Button } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  initialValue?: ResUser["data"]["user_status"] | null;
  noLabel?: boolean;
  small?: boolean;
  mode?: SelectProps["mode"];    
  withCheckbox?: boolean; 
}

const UserStatusSelector = ({
  noLabel,
  small,
  initialValue = "ACTIVE",
  mode,
  withCheckbox,
}: Props) => {
  const { t } = useTranslation();

  const options: SelectProps["options"] = useMemo(
    () => [
      { label: t("memberInfoEdit.mie010"), value: "ACTIVE" },
      { label: t("memberInfo.royalBlack"), value: "ROYALBLACK" },
      {
        label: <span style={{ color: "var(--ant-color-error)" }}>{t("memberInfo.mi036")}</span>,
        value: "OBSERVATION",
      },
      { label: t("memberInfoEdit.mie013"), value: "DEACTIVATED" },
      { label: t("memberInfoEdit.mie012"), value: "SUSPENDED" },
      { label: t("memberInfoEdit.mie034"), value: "UNVERIFIED" },
    ],
    [t]
  );

  const form = Form.useFormInstance();
  const watched = Form.useWatch("user_status") as any;

  const selectedSet = useMemo(() => {
    if (mode === "multiple") {
      const arr = watched ?? [];
      return new Set(arr); 
    }
    return new Set(watched ? [watched] : []);
  }, [watched, mode]);

  const allValues = useMemo(() => (options ?? []).map((o: any) => o.value), [options]);
  const isAllSelected =
    allValues.length > 0 && allValues.every((v) => selectedSet.has(v));

  const setAll = () => form.setFieldValue("user_status", allValues);
  const clearAll = () => form.setFieldValue("user_status", []);

  const header =
    withCheckbox && mode === "multiple" ? (
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
          disabled={allValues.length === 0}
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
    ) : null;

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
    <Form.Item
      name={"user_status"}
      label={noLabel ? undefined : t("memberInfoEdit.mie009")}
      rules={[{ required: true }]}
      initialValue={initialValue}
      style={{ width: "100%" }}
    >
      <Select
        size={small ? "small" : "middle"}
        mode={mode}
        options={options}
        allowClear
        {...checkboxProps}
      />
    </Form.Item>
  );
};

export default UserStatusSelector;
