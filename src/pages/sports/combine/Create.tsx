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
  Radio,
  Select,
} from "antd";
import { createSportsCombineAPI } from "@/api/sports-list/post";
import SaveBtn from "@/components/SaveBtn";
import SportsOptions from "../SportsOptions.json";

const SportsCombineCreate = () => {
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    try {
      setLoading(true);

      const res = await createSportsCombineAPI({
        gameType: e.gameType?.value,
        sportsName: e.sportsName?.value,
        leagueType: e.leagueType,
        matchType: e.matchType,
        marketType1: e.marketType1?.value,
        periodType1: e.periodType1?.value,
        betType1: e.betType1?.value,
        marketType2: e.marketType2?.value,
        periodType2: e.periodType2?.value,
        betType2: e.betType2?.value,
        errorMessage: e.errorMessage,
        status: e.status,
      });

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        form.resetFields();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sports.combineCreate")} />
      </Space>
      <Divider />
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          matchType: i18next.t("sports.allMatches"),
          leagueType: i18next.t("sports.allLeagues"),
          status: 1,
        }}
      >
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.gameType")}
              name={"gameType"}
              rules={[{ required: true, message: i18next.t("validation.selectGameType") }]}
            >
              <Select
                labelInValue
                options={SportsOptions.gameTypeOptions}
                placeholder={i18next.t("sports.selectGameType")}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.sportType")}
              name={"sportsName"}
              rules={[
                { required: true, message: i18next.t("validation.selectSportType") },
              ]}
            >
              <Select
                labelInValue
                options={SportsOptions.sportsNameMarketOptions}
                placeholder={i18next.t("sports.selectSportType")}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("sports.leagueType")} name={"leagueType"}>
              <Radio.Group
                name="leagueradiogroup"
                options={[
                  { value: "전체리그", label: i18next.t("sports.allLeagues") },
                  { value: "동일리그", label: i18next.t("sports.sameLeague") },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18next.t("sports.matchType")} name={"matchType"}>
              <Radio.Group
                name="matchradiogroup"
                options={[
                  { value: "전체경기", label: i18next.t("sports.allMatches") },
                  { value: "동일경기", label: i18next.t("sports.sameMatch") },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.marketType1")}
              name={"marketType1"}
              rules={[
                { required: true, message: i18next.t("validation.selectMarketType1") },
              ]}
            >
              <Select
                labelInValue
                options={SportsOptions.marketTypeOptions}
                placeholder={i18next.t("sports.selectMarketType1")}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.marketType2")}
              name={"marketType2"}
              rules={[
                { required: true, message: i18next.t("validation.selectMarketType2") },
              ]}
            >
              <Select
                labelInValue
                options={SportsOptions.marketTypeOptions}
                placeholder={i18next.t("sports.selectMarketType2")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.periodType1")}
              name={"periodType1"}
              rules={[
                { required: true, message: i18next.t("validation.selectPeriodType1") },
              ]}
            >
              <Select
                labelInValue
                options={SportsOptions.periodTypeOptions}
                placeholder={i18next.t("sports.selectPeriodType")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.periodType2")}
              name={"periodType2"}
              rules={[
                { required: true, message: i18next.t("validation.selectPeriodType2") },
              ]}
            >
              <Select
                labelInValue
                options={SportsOptions.periodTypeOptions}
                placeholder={i18next.t("sports.selectPeriodType")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.betType1")}
              name={"betType1"}
              rules={[
                { required: true, message: i18next.t("validation.selectBetType1") },
              ]}
            >
              <Select
                labelInValue
                options={SportsOptions.betTypeOptions}
                placeholder={i18next.t("sports.selectBetType")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.betType2")}
              name={"betType2"}
              rules={[
                { required: true, message: i18next.t("validation.selectBetType2") },
              ]}
            >
              <Select
                labelInValue
                options={SportsOptions.betTypeOptions}
                placeholder={i18next.t("sports.selectBetType")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={i18next.t("title.errorMessage")}
              name={"errorMessage"}
              rules={[
                { required: true, message: i18next.t("validation.enterErrorMessage") },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18next.t("couponsLog.cl005")} name={"status"}>
              <Radio.Group
                name="statusradiogroup"
                options={[
                  { value: 1, label: i18next.t("status.use") },
                  { value: 0, label: i18next.t("status.unused") },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <SaveBtn loading={loading} />
      </Form>
    </Card>
  );
};

export default SportsCombineCreate;
