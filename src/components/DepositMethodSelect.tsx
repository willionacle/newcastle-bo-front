import i18next from "@/i18n/i18n";
import { useDepositMethodList } from "@/api/deposit-method/get";
import { Form, Select, SelectProps } from "antd";

export type ItemSelectFormType = number;

interface Props {
  small?: boolean;
}

const DepositMethodSelect = ({ small }: Props) => {
  const { data } = useDepositMethodList();

  const options: SelectProps["options"] = data?.map((item) => ({
    label: item.title,
    value: item.type,
  }));

  return (
    <Form.Item label={i18next.t("col.depositMethod")} name={"deposit_method"}>
      <Select options={options} size={small ? "small" : "middle"} />
    </Form.Item>
  );
};

export default DepositMethodSelect;
