import i18next from "@/i18n/i18n";
import { Form, Select } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  defaultValue?: string;
}

const PaymentStatusSelector = ({ defaultValue }: Props) => {
  const { t } = useTranslation();

  return (
    <Form.Item
      label={t("deposit.de002")}
      name="status"
      initialValue={defaultValue}
    >
      <Select size="small" allowClear>
        <Select.Option value="Waiting">{i18next.t("global.waiting")} </Select.Option>
        <Select.Option value="Cancelled">{i18next.t("global.cancel")}</Select.Option>
        <Select.Option value="Completed">{i18next.t("global.complete")}</Select.Option>
        <Select.Option value="Applied">{i18next.t("deposit.de006")}</Select.Option>
      </Select>
    </Form.Item>
  );
};

export default PaymentStatusSelector;
