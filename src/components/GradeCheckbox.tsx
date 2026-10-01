import i18next from "@/i18n/i18n";
import { Form, Checkbox } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";

interface Props extends CheckboxGroupProps {
  defaultValue?: number[];
  name?: string;
  label?: string;
  hideAll?: boolean;
  required?: boolean;
}

const GradeCheckbox = ({ defaultValue = [0], name = 'user_grade', label, hideAll, required = false, ...props }: Props) => {
  return (
    <Form.Item
      name={name}
      initialValue={defaultValue}
      label={label}
      required={required}
      rules={[{required: required}]}
    >
      <Checkbox.Group {...props}>
        {!hideAll && <Checkbox value={0}>{i18next.t("col.all")}</Checkbox>}
        <Checkbox value={1}>{i18next.t("grade.bronze")}</Checkbox>
        <Checkbox value={2}>{i18next.t("grade.silver")}</Checkbox>
        <Checkbox value={3}>{i18next.t("grade.gold")}</Checkbox>
        <Checkbox value={4}>{i18next.t("grade.emerald")}</Checkbox>
        <Checkbox value={5}>{i18next.t("grade.ruby")}</Checkbox>
        <Checkbox value={6}>{i18next.t("grade.diamond")}</Checkbox>
        <Checkbox value={7}>{i18next.t("grade.blackDiamond")}</Checkbox>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default GradeCheckbox;
