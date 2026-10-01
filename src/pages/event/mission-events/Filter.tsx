import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { Col, Form, Input, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import DateRangeTag from "@/components/DateRangeTag";
import { SetStateAction, useEffect } from "react";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";

interface FormProps {
  dateRange: DateRangeType;
  username: string;
  user_real_name: string;
  status: string;
}

interface Props {
  setFilter: SetStateAction<any | undefined>
}

interface QueryData {
  dateRange: string[];
  username: string;
  user_real_name: string;
  status: string;
}

const Filter = ({setFilter}: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    console.log('user filter stats',e)
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/event/mission-event-list",
      search: stringify({
        ...q,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        username: e.username ? e.username : undefined,
        user_real_name: e.user_real_name ? e.user_real_name : undefined,
        status: e.status ? e.status : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('filter effect',e)
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });
    setFilter((prevData: any) => ({
      ...prevData,
      status: e.status ? e.status : null,
      username: e.username ? e.username : null,
      user_real_name: e.user_real_name ? e.user_real_name : null,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
    }))
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col >
          <DateRangeTag />
        </Col>

        <Col>
          <Form.Item label="ID" name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={i18next.t("col.name")} name={"user_real_name"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col
          style={{ alignSelf: "center", marginTop: "-1.2rem" }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
