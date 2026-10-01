import i18next from "@/i18n/i18n";
import { Form, Select } from "antd";
import { SelectProps } from "antd";
import { useTranslation } from "react-i18next";
interface Props extends SelectProps {
  defaultValue?: string | null;
  name?: string;
  label?: string;
  hideAll?: boolean;
}

const UserStatusSelect = ({ defaultValue = "", name = 'user_status', label = i18next.t("col.status"), hideAll, ...props }: Props) => {
  const { t } = useTranslation();
  return (
    <Form.Item
      name={name}
      initialValue={defaultValue}
      label={label}
    >
      <Select size="small" {...props}>
        {!hideAll && (
          <Select.Option value="">
            {t("memberInfo.mi011")}
          </Select.Option>
        )}
        
        <Select.Option value="ACTIVE">
          {t("memberInfo.mi012")}
        </Select.Option>
        <Select.Option value="ROYALBLACK">
          {t("memberInfo.royalBlack")}
        </Select.Option>
        <Select.Option value="OBSERVATION">
          <span style={{ color: "blue" }}>{t("memberInfo.mi036")}</span>
        </Select.Option>
        <Select.Option value="DEACTIVATED">
          {t("memberInfo.mi014")}
        </Select.Option>
        <Select.Option value="SUSPENDED">
          <span style={{ color: "var(--ant-color-error)" }}>
            {t("memberInfo.mi015")}
          </span>
        </Select.Option>
        <Select.Option value="UNVERIFIED">
          {t("memberInfo.mi030")}
        </Select.Option>
      </Select>
    </Form.Item>
  );
};

export default UserStatusSelect;
