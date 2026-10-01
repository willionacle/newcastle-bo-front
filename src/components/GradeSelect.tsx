import i18next from "@/i18n/i18n";
import { Form, Select } from "antd";
import { SelectProps } from "antd";
interface Props extends SelectProps {
  defaultValue?: number | null;
  name?: string;
  label?: string;
  hideAll?: boolean;
}

const GradeSelect = ({ defaultValue = 0, name = 'user_grade', label, hideAll, ...props }: Props) => {
  return (
    <Form.Item
      name={name}
      initialValue={defaultValue}
      label={label}
    >
      <Select size="small" {...props}>
        {!hideAll && <Select.Option value={0}>{i18next.t("col.all")}</Select.Option>}
        <Select.Option value={1}>{i18next.t("grade.bronze")}</Select.Option>
        <Select.Option value={2}>{i18next.t("grade.silver")}</Select.Option>
        <Select.Option value={3}>{i18next.t("grade.gold")}</Select.Option>
        <Select.Option value={4}>{i18next.t("grade.emerald")}</Select.Option>
        <Select.Option value={5}>{i18next.t("grade.ruby")}</Select.Option>
        <Select.Option value={6}>{i18next.t("grade.diamond")}</Select.Option>
        <Select.Option value={7}>{i18next.t("grade.blackDiamond")}</Select.Option>
      </Select>
    </Form.Item>
  );
};

export default GradeSelect;
