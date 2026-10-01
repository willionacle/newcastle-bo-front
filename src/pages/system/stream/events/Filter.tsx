import i18next from "@/i18n/i18n";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  setFilters: (updater: (prev: any) => any) => void;
}

interface FormProps {
  dateRange: DateRangeType;
  filter_type: string;
  filter_league: string;
}

interface QueryProps {
  dateRange: string[] | undefined;
  filter_league: string;
  filter_hometeam: string;
  filter_awayteam: string;
  title: string;
}

const Filter = ({ setFilters }: Props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FormProps>();

  const handleSubmit = (values: FormProps) => {
    const query = parse(search.replace("?", "")) as unknown as QueryProps;

    navigate({
      pathname: "/stream/events",
      search: stringify(
        {
          ...query,
          ...values,
          page: 1,
          dateRange: values.dateRange
            ? [
                values.dateRange[0]?.tz().format(),
                values.dateRange[1]?.tz().format(),
              ]
            : undefined,
        },
        { arrayFormat: "repeat" }
      ),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      filter_startdate: e.dateRange
        ? GF.formatDate(e.dateRange[0], true)
        : null,
      filter_enddate: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
      filter_league: e.filter_league,
      filter_hometeam: e.filter_hometeam,
      filter_awayteam: e.filter_awayteam,
      title: e.title,
    }));
  }, [search]);

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      form={form}
      style={{ marginBottom: "20px" }}
    >
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.title")} name="title" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        
        <Col {...filterColProps}>
          <DateRange required={false} />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.leagueName")} name="filter_league" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.homeTeam")} name="filter_hometeam" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.awayTeam")} name="filter_awayteam" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
