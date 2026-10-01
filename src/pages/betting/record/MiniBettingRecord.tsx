import i18next from "@/i18n/i18n";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space, Form, Row, Col, Select, Input } from "antd";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import MiniOptions from "../../mini/MiniOptions.json";
import { getMiniBetTypeListAPI } from "@/api/mini-game/get";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import MiniBettingRecordTable from "@/components/MiniBettingRecordTable";

interface FormProps {
  dateRange: DateRangeType;
  game: { label: string; value: string };
  minute: { label: string; value: string | number };
  betTypeId: { label: string; value: string | number };
  status: { label: string; value: string | number };
  username: string;
  round: string;
  key: string;
}

interface QueryData {
  dateRange: string[] | undefined;
  game: { label: string; value: string };
  minute: { label: string; value: string | number };
  betTypeId: { label: string; value: string | number };
  status: { label: string; value: string | number };
  username: string | undefined;
  round: string | undefined;
  key: string | undefined;
}

const MiniBettingRecord = () => {
  const { search } = useLocation();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const [query, setQuery] = useState<QueryData | null>(null);
  const [betTypeOptions, setBetTypeOptions] = useState([
    { value: "", label: i18next.t("col.all") },
  ]);

  const fetchBetTypeList = async () => {
    const res = await getMiniBetTypeListAPI({
      page: 1,
      size: 999,
      game: form.getFieldValue("game")?.value,
    });

    if (res) {
      const newOptions = [{ value: "", label: i18next.t("col.all") }];
      res.data.forEach((x: any) => {
        newOptions.push({ value: x.id, label: x.name });
      });
      setBetTypeOptions(newOptions);
    }
  };

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
      pathname: "/betting/mini",
      search: stringify(newQuery),
    });
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("betting.minigameBetRecord")} />
      </Space>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          game: { value: "", label: i18next.t("col.all") },
          minute: { value: "", label: i18next.t("col.all") },
          betTypeId: { value: "", label: i18next.t("col.all") },
          status: { value: "", label: i18next.t("col.all") },
        }}
        onValuesChange={(changedValues) => {
          if (changedValues.game) {
            fetchBetTypeList();
          }
        }}
      >
        <Row gutter={16}>
          <Col>
            <DateRange showTime />
          </Col>
          <Col>
            <Form.Item label={i18next.t("memberDetail.mis051")} name={"game"}>
              <Select
                labelInValue
                options={MiniOptions.gameFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("betting.gameTime")} name={"minute"}>
              <Select
                labelInValue
                options={MiniOptions.minuteFilterOptions}
                size="small"
                style={{ width: 80 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("betting.betType")} name={"betTypeId"}>
              <Select
                labelInValue
                options={betTypeOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.status")} name={"status"}>
              <Select
                labelInValue
                options={MiniOptions.betStatusFilterOptions}
                size="small"
                style={{ width: 80 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.userId")} name={"username"}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("sportsScore.round")} name={"round"}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("sportsBet.betKey")} name={"key"}>
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
        <MiniBettingRecordTable
          game={query.game?.value}
          minute={query.minute?.value}
          betTypeId={query.betTypeId?.value}
          status={query.status?.value}
          username={query.username}
          round={query.round}
          betKey={query.key}
          dateRange={query.dateRange}
        />
      )}
    </Card>
  );
};

export default MiniBettingRecord;
