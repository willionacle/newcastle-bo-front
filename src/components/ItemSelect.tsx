import i18next from "@/i18n/i18n";
import { findItemAllAPI } from "@/api/custom/itemAll";
import { Form, Select, SelectProps } from "antd";

export type ItemSelectFormType = number;

interface Props {
  small?: boolean;
}

const ItemSelect = ({ small }: Props) => {
  const { data } = findItemAllAPI();

  const options: SelectProps["options"] = data?.map((item) => ({
    label: item.itemName,
    value: item.id,
  }));

  return (
    <Form.Item label={i18next.t("depositBonusDetail.dbe013")} name={"gameitemId"} required>
      <Select options={options} size={small ? "small" : "middle"} />
    </Form.Item>
  );
};

export default ItemSelect;
