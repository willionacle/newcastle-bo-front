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
import { createVrCombineAPI } from "@/api/vr-game/post";
import SaveBtn from "@/components/SaveBtn";
import VrOptions from "../VrOptions.json";

const VrCombineCreate = () => {
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    try {
      setLoading(true);

      const res = await createVrCombineAPI({
        sportsName: e.sportsName?.value,
        matchType: e.matchType,
        marketType1: e.marketType1?.value,
        betType1: e.betType1?.value,
        marketType2: e.marketType2?.value,
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
        <Breadcrumb replace={i18next.t("vrCfg.combineCreate")} />
      </Space>
      <Divider />
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          matchType: i18next.t("sports.allMatches"),
          status: 1,
        }}
      >
        <Row gutter={[16, 0]}>
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
                options={VrOptions.sportsNameMarketOptions}
                placeholder={i18next.t("sports.selectSportType")}
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
                options={VrOptions.marketTypeOptions}
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
                options={VrOptions.marketTypeOptions}
                placeholder={i18next.t("sports.selectMarketType2")}
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
                options={VrOptions.betTypeOptions}
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
                options={VrOptions.betTypeOptions}
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

export default VrCombineCreate;
