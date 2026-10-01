import Btn from "@/components/Btn";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import { Form, Space } from "antd";
import { CSSProperties } from "react";

interface FormProps {
  dateRange: DateRangeType;
}

const btnStyle: CSSProperties = {
  marginBottom: "1em",
};

const Filter = () => {
  const [form] = Form.useForm<FormProps>();

  return (
    <Form form={form} layout="vertical">
      <Space size={"middle"} align="center">
        <DateRangeTag />

        <Btn
          btnType="search"
          size="small"
          type="default"
          htmlType="submit"
          style={btnStyle}
        />
      </Space>
    </Form>
  );
};

export default Filter;
