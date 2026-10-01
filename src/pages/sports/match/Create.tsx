import { useState } from "react";
import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Card,
  Divider,
  Space,
  Form,
  Col,
  Row,
  notification,
  Input,
  Select,
  DatePicker,
  Table,
  Button,
} from "antd";
import { getSportsMarketListAPI } from "@/api/sports-list/get";
import { createSportsMatchAPI } from "@/api/sports-list/post";
import SportsOptions from "../SportsOptions.json";
import SaveBtn from "@/components/SaveBtn";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

interface MatchFormData {
  sportsName: {
    value: string;
    label: string;
  };
  startTime: string;
  league: string;
  country: string;
  home: string;
  away: string;
}

interface OddsFormData {
  market: {
    value: number;
    label: string;
  };
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}

interface oddsItem {
  marketId: number;
  marketName: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}

interface marketOption {
  label: string;
  value: number;
}

const SportsMatchCreate = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<MatchFormData>();
  const [form2] = Form.useForm<OddsFormData>();
  const [loading, setLoading] = useState(false);
  const [oddsData, setOddsData] = useState<oddsItem[]>([]);
  const [marketOptions, setMarketOptions] = useState<marketOption[]>([]);

  const handleSubmit = async (e: MatchFormData) => {
    try {
      setLoading(true);
      const res = await createSportsMatchAPI({
        ...e,
        sportsName: e.sportsName.value,
        startTime: dayjs(e.startTime).format("YYYY-MM-DD HH:mm:ss"),
        oddsData: JSON.stringify(oddsData),
      });

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        form.resetFields();
        form2.resetFields();
        setOddsData([]);
        setMarketOptions([]);
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("col.market"),
      align: "center",
      dataIndex: "marketName",
      key: "marketName",
    },
    {
      title: i18next.t("col.home"),
      align: "center",
      render: (_, record) => (
        <Input
          size="small"
          type="number"
          style={{ width: 120 }}
          defaultValue={record.homeOdds}
          onChange={(e) => {
            setOddsData((prev: any) =>
              prev.map((item: any) =>
                item.marketId === record.marketId
                  ? { ...item, homeOdds: e.target.value }
                  : item
              )
            );
          }}
        />
      ),
    },
    {
      title: i18next.t("sportsBet.draw"),
      align: "center",
      render: (_, record) => {
        return (
          <Input
            size="small"
            type="number"
            style={{ width: 120 }}
            defaultValue={record.drawOdds}
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.marketId === record.marketId
                    ? { ...item, drawOdds: e.target.value }
                    : item
                )
              );
            }}
          />
        );
      },
    },
    {
      title: i18next.t("col.away"),
      align: "center",
      render: (_, record) => (
        <Input
          size="small"
          type="number"
          style={{ width: 120 }}
          defaultValue={record.awayOdds}
          onChange={(e) => {
            setOddsData((prev: any) =>
              prev.map((item: any) =>
                item.marketId === record.marketId
                  ? { ...item, awayOdds: e.target.value }
                  : item
              )
            );
          }}
        />
      ),
    },
    {
      title: i18next.t("global.delete"),
      align: "center",
      render: (_, record) => (
        <Button onClick={() => removeOddsData(record.marketId)}>{i18next.t("global.delete")}</Button>
      ),
    },
  ];

  const addOddsData = (e: OddsFormData) => {
    if (oddsData.find((x) => x.marketId === e.market.value)) {
      return notification.error({ message: t("toast.sports.marketAlreadyAdded") });
    }

    setOddsData((prev) => {
      return [
        ...prev,
        {
          marketId: e.market.value,
          marketName: e.market.label,
          homeOdds: e.homeOdds,
          drawOdds: e.drawOdds,
          awayOdds: e.awayOdds,
        },
      ];
    });

    form2.resetFields();
  };

  const removeOddsData = (id: number) => {
    setOddsData((prev) => prev.filter((x) => x.marketId !== id));
  };

  const fetchMarketList = async () => {
    setOddsData([]);
    setMarketOptions([]);
    form2.resetFields();

    const res = await getSportsMarketListAPI({
      page: 1,
      size: 999,
      sportsName: form.getFieldValue("sportsName")?.value,
    });

    res.data.forEach((x: any) => {
      setMarketOptions((prev) => {
        return [...prev, { label: x.name, value: x.market_id }];
      });
    });
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sports.matchCreate")} />
      </Space>
      <Divider />
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <SaveBtn loading={loading} />
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.sportType")}
              name={"sportsName"}
              rules={[
                { required: true, message: t("validation.selectSport") },
              ]}
            >
              <Select
                labelInValue
                options={SportsOptions.sportsNameOptions}
                placeholder={i18next.t("sports.selectSportType")}
                onChange={fetchMarketList}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("sportsBet.matchTime")}
              name={"startTime"}
              rules={[{ required: true, message: t("validation.enterMatchTime") }]}
            >
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("col.countryName")}
              name={"country"}
              rules={[{ required: true, message: t("validation.enterCountry") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={i18next.t("col.leagueName")}
              name={"league"}
              rules={[{ required: true, message: t("validation.enterLeague") }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.homeTeamName")}
              name={"home"}
              rules={[{ required: true, message: t("validation.enterHomeTeam") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.awayTeamName")}
              name={"away"}
              rules={[{ required: true, message: t("validation.enterAwayTeam") }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />

      <Form layout="vertical" form={form2} onFinish={addOddsData}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{i18next.t("sports.registerOdds")}</h3>
          <Button htmlType="submit">{i18next.t("sports.addOdds")}</Button>
        </div>
        <Row gutter={[16, 0]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Form.Item
              label={i18next.t("col.market")}
              name={"market"}
              rules={[{ required: true, message: t("validation.selectMarket") }]}
            >
              <Select
                labelInValue
                options={marketOptions}
                placeholder={i18next.t("sports.selectMarket")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={i18next.t("col.home")}
              name={"homeOdds"}
              rules={[{ required: true, message: t("validation.enterHomeOdds") }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={i18next.t("sports.drawOrHandicap")} name={"drawOdds"}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={i18next.t("col.away")}
              name={"awayOdds"}
              rules={[{ required: true, message: t("validation.enterAwayOdds") }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="marketId"
        columns={columns}
        dataSource={oddsData}
        pagination={false}
      />
      <Divider />
    </Card>
  );
};

export default SportsMatchCreate;
