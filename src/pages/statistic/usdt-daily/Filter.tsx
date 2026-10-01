import Btn from "@/components/Btn";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import { GF } from "@/utils/GlobalFunctions";
import { Form, Space } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { CSSProperties, SetStateAction, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilter: SetStateAction<any | undefined>
}

interface FormProps {
  dateRange: DateRangeType;
}

interface QueryData {
  dateRange: string[];
}

const btnStyle: CSSProperties = {
  marginBottom: "1em",
};

const Filter = ({setFilter}: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/statistic/usdt-daily",
      search: stringify({
        ...q,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

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
    }))
  }, [search])

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
