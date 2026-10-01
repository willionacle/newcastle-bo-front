import i18next from "@/i18n/i18n";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space, Form, Row, Col, Select, Input } from "antd";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import SportsOptions from "../../sports/SportsOptions.json";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
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
}

const SportsBettingRecord = ({user}:{user?: ResUser['data']}) => {
  const { search, pathname } = useLocation();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const [query, setQuery] = useState<QueryData | null>(null);

  // Checker to see if this component is mounted at user details page
  const isAtUserDetailsPage = Boolean(user?.username);

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setQuery(e);
  }, [search]);

  const handleSubmit = (values: any) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    const formatted = {
      ...values,
      dateRange: values.dateRange
        ? [
            dayjs(values.dateRange[0]).format("YYYY-MM-DD HH:mm:ss"),
            dayjs(values.dateRange[1]).format("YYYY-MM-DD HH:mm:ss"),
          ]
        : undefined,
    };

    const newQuery = {
      ...q,
      ...formatted,
    };

    navigate({
      pathname,
      search: stringify({
        ...newQuery,
        tab: pathname.includes('/user') ? "bettingLog" : undefined,
      }),
    });
  };

  return (
    <Card>
      {!isAtUserDetailsPage && (
        <>
          <Space align="center">
            <Breadcrumb replace={i18next.t("sidemenu.domesticSportsBettingRecords")} />
          </Space>
          <Divider />
        </>
      )}

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
        {!isAtUserDetailsPage && (
          <Col>
            <Form.Item label={i18next.t("col.userId")} name={"username"}>
              <Input size="small" />
            </Form.Item>
          </Col>
        )}
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
