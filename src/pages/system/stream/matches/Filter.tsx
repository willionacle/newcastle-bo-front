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
import MatchTypeSelect from "../../../../components/MatchTypeSelect";

interface Props {
  setFilters: (updater: (prev: any) => any) => void;
}

interface FormProps {
  dateRange: DateRangeType;
  filter_type: string;
  filter_league: string;
  filter_isLive: boolean;
}

interface QueryProps {
  dateRange: string[] | undefined;
  filter_type: string;
  filter_league: string;
  filter_home: string;
  filter_away: string;
  filter_isLive: boolean;
}

const Filter = ({ setFilters }: Props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FormProps>();

  const handleSubmit = (values: FormProps) => {
    const query = parse(search.replace("?", "")) as unknown as QueryProps;

    navigate({
      pathname: "/stream/matches",
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
      filter_starttime: e.dateRange
        ? GF.formatDate(e.dateRange[0], true)
        : null,
      filter_endtime: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
      filter_type: e.filter_type,
      filter_league: e.filter_league,
      filter_home: e.filter_home,
      filter_away: e.filter_away,
      filter_isLive: e.filter_isLive,
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
          <DateRange required={false} showTime />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.sport")} name="filter_type" initialValue="">
            <MatchTypeSelect />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.leagueName")} name="filter_league" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.homeTeam")} name="filter_home" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.awayTeam")} name="filter_away" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        {/* <Col {...filterColProps}>
          <Form.Item label="Live" name="filter_isLive" initialValue="">
            <Select
              options={[
                { label: "LIVE", value: "1" },
                { label: "WAITING", value: "0" },
              ]}
              size="small"
            />
          </Form.Item>
        </Col> */}

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
