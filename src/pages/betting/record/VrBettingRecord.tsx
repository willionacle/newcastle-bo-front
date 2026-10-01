import i18next from "@/i18n/i18n";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space, Form, Row, Col, Select, Input } from "antd";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import VrOptions from "../../vr/VrOptions.json";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import VrBettingRecordTable from "@/components/VrBettingRecordTable";

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

const VrBettingRecord = () => {
  const { search } = useLocation();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const [query, setQuery] = useState<QueryData | null>(null);

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
      pathname: "/betting/vr",
      search: stringify(newQuery),
    });
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("betting.virtualBetRecord")} />
      </Space>
      <Divider />

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
            <Form.Item label={i18next.t("col.status")} name={"status"}>
              <Select
                labelInValue
                options={VrOptions.bettingStatusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.userId")} name={"username"}>
              <Input size="small" />
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
        <VrBettingRecordTable
          status={query.status?.value}
          username={query.username}
          betKey={query.key}
          dateRange={query.dateRange}
        />
      )}
    </Card>
  );
};

export default VrBettingRecord;
