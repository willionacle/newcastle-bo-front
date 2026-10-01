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
} from "antd";
import { createVrBonusAPI } from "@/api/vr-game/post";
import SaveBtn from "@/components/SaveBtn";

const VrBonusCreate = () => {
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormData) => {
    try {
      setLoading(true);

      const res = await createVrBonusAPI(e);

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
        <Breadcrumb replace={i18next.t("vrCfg.bonusCreate")} />
      </Space>
      <Divider />
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.folderCount")}
              name={"folderCount"}
              rules={[{ required: true, message: i18next.t("validation.enterFolderCount") }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("col.odds")}
              name={"odds"}
              rules={[{ required: true, message: i18next.t("validation.enterOdds") }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("title.minOdds")}
              name={"minOdds"}
              rules={[{ required: true, message: i18next.t("validation.enterMinOdds") }]}
            >
              <Input type="number" />
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
            <Form.Item
              label={i18next.t("sports.homeTeamName")}
              name={"homeName"}
              rules={[{ required: true, message: i18next.t("validation.enterHomeTeamName") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={i18next.t("sports.awayTeamName")}
              name={"awayName"}
              rules={[{ required: true, message: i18next.t("validation.enterAwayTeamName") }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("col.status")} name={"status"}>
              <Radio.Group
                name="radiogroup"
                defaultValue={1}
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

export default VrBonusCreate;
