import { Form, Space } from "antd";
import { CSSProperties, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import Btn from "@/components/Btn";
export interface FormProps {
  dateRange: DateRangeType;
  game_id?: string | null;
}

export interface QueryData {
  dateRange: string[] | undefined;
  game_id: string | undefined;
  game_category?: string;
}

interface Props {
  setFilters: any;
}

const btnStyle: CSSProperties = {
  marginBottom: "1em",
};

const Filter = ({ setFilters }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const handleSubmit = (e: any) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: `${pathname}`,
      search: stringify({
        ...query,
        tab: "dailystats",
        game_id: e.game_id ? e.game_id : null,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData

    form.setFieldsValue({
      game_id: e.game_id ? e.game_id : null,
      dateRange: e.dateRange ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
      : [null, null],
    })
    setFilters((prevData: any) => ({
      ...prevData,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
      vendor_id: e.game_id ? e.game_id : null,
    }))
  }, [search,pathname])

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
