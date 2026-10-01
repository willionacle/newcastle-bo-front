import i18next from "@/i18n/i18n";
import { Form, Select } from "antd";
import { SelectProps } from "antd";
interface Props extends SelectProps {
  defaultValue?: string;
  name?: string;
  label?: string;
  hideAll?: boolean;
}

const RegulationsSelect = ({
  hideAll = false,
  defaultValue = "",
  name = "type",
  label,
  ...props
}: Props) => {
  return (
    <Form.Item name={name} initialValue={defaultValue} label={label}>
      <Select size="small" {...props}>
        {!hideAll && <Select.Option value="">{i18next.t("col.all")}</Select.Option>}
        <Select.Option value="sport">{i18next.t("col.sportsRegulation")}</Select.Option>
        <Select.Option value="betting">{i18next.t("col.bettingRegulation")}</Select.Option>
      </Select>
    </Form.Item>
  );
};

export default RegulationsSelect;
