import Btn from "@/components/Btn";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import { GF } from "@/utils/GlobalFunctions";
import { Form, Space } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { CSSProperties, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface FormProps {
  dateRange: DateRangeType;
}

interface Props {
  setFilter: any;
}

const btnStyle: CSSProperties = {
  marginBottom: "1em",
};

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    navigate({
      pathname: "/statistic/agent",
      search: stringify({
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as any;
    console.log("filter effect", e);
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });
    setFilter((prevData: any) => ({
      ...prevData,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
