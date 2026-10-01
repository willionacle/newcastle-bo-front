import { Form, Select } from "antd";

interface Props {
  defaultValue?: string;
  name?: string;
}

const AppUsageSelector = ({ defaultValue, name }: Props) => {

  return (
    <Form.Item
      label={"App"}
      name={name || "has_app_login"}
      initialValue={defaultValue}
    >
      <Select size="small" allowClear>
        <Select.Option value="false">X</Select.Option>
        <Select.Option value="true">O</Select.Option>
      </Select>
    </Form.Item>
  );
};

export default AppUsageSelector;
