import i18next from "@/i18n/i18n";
import { useEffect, useState } from "react";
import { Card, Divider, Form, Row, Col, Select, Input } from "antd";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import SportsOptions from "../../../../sports/SportsOptions.json";
import dayjs from "dayjs";
// import { useLocation } from "react-router-dom";
// import { parse } from "qs";
import SportsBettingRecordTable from "@/components/SportsBettingRecordTable";
import { ResUser } from "@/api/types";

interface FormProps {
  dateRange: DateRangeType;
  gameType: { label: string; value: string };
  status: { label: string; value: string | number };
  username: string;
  key: string;
}

interface QueryData {
  dateRange: string[] | undefined;
  gameType: { label: string; value: string };
  status: { label: string; value: string | number };
  username: string | undefined;
  key: string | undefined;
  dateRangeMI?: DateRangeType;
}

const SportsBettingRecord = ({user,defaultDateRange}:{user?: ResUser['data'],defaultDateRange:any}) => {
  // const { search } = useLocation();
  const [form] = Form.useForm<FormProps>();

  const [query, setQuery] = useState<QueryData>({
    dateRange: undefined,
    gameType: { value: "", label: i18next.t("col.all") },
    status: { value: "", label: i18next.t("col.all") },
    username: user?.username,
    key: undefined,
  });

  useEffect(() => {
    // const e = parse(search.replace("?", "")) as unknown as QueryData;

    const formData = {
      gameType: { value: "", label: i18next.t("col.all") },
      status: { value: "", label: i18next.t("col.all") },
      username: user?.username,
      key: undefined,
      dateRange: defaultDateRange ? [dayjs(defaultDateRange[0]), dayjs(defaultDateRange[1])] : undefined,
    };

    const queryData: QueryData = {
      ...formData,
      dateRange: defaultDateRange ? [
        dayjs(defaultDateRange[0]).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(defaultDateRange[1]).format("YYYY-MM-DD HH:mm:ss")
      ] : undefined,
    };

    form.setFieldsValue(formData); 
    setQuery(queryData);           
  }, [user]);

  const handleSubmit = (values: any) => {
    const formattedQuery: QueryData = {
      ...values,
      username: user?.username,
      dateRange: values.dateRange?.[0] 
        ? [
            dayjs(values.dateRange[0]).format("YYYY-MM-DD HH:mm:ss"),
            dayjs(values.dateRange[1]).format("YYYY-MM-DD HH:mm:ss"),
          ]
        : undefined,
    };

    setQuery(formattedQuery);
  };

  return (
    <Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          gameType: { value: "", label: i18next.t("col.all") },
          status: { value: "", label: i18next.t("col.all") },
        }}
      >
        <Row gutter={16}>
          <Col>
            <DateRange showTime />
          </Col>
          <Col>
            <Form.Item label={i18next.t("sportsBet.gameType")} name={"gameType"}>
              <Select
                labelInValue
                options={SportsOptions.gameTypeFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.status")} name={"status"}>
              <Select
                labelInValue
                options={SportsOptions.bettingStatusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("betting.betKey")} name={"key"}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col style={{ alignSelf: "center" }}>
            <SearchBtn size="small" block />
          </Col>
        </Row>
      </Form>

      <Divider />

      {query && (
        <SportsBettingRecordTable
          gameType={query.gameType?.value}
          status={query.status?.value}
          username={query.username}
          betKey={query.key}
          dateRange={query.dateRange}
        />
      )}
    </Card>
  );
};

export default SportsBettingRecord;
