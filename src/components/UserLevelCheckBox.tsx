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

const UserLevelCheckBox = ({ defaultValue = [0], name = 'user_level', label, hideAll, required = false, ...props }: Props) => {
  return (
    <Form.Item
      name={name}
      initialValue={defaultValue}
      label={label}
      required={required}
      rules={[{required: required}]}
    >
      <Checkbox.Group {...props}>
        <Checkbox value={1}>{i18next.t("level.l1")}</Checkbox>
        <Checkbox value={2}>{i18next.t("level.l2")}</Checkbox>
        <Checkbox value={3}>{i18next.t("level.l3")}</Checkbox>
        <Checkbox value={4}>{i18next.t("level.l4")}</Checkbox>
        <Checkbox value={5}>{i18next.t("level.l5")}</Checkbox>
        <Checkbox value={6}>{i18next.t("level.l6")}</Checkbox>
        <Checkbox value={7}>{i18next.t("level.l7")}</Checkbox>
        <Checkbox value={8}>{i18next.t("level.l8")}</Checkbox>
        <Checkbox value={9}>{i18next.t("level.l9")}</Checkbox>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default UserLevelCheckBox;
