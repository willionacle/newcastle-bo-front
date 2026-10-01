import i18next from "@/i18n/i18n";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { getVrSportsConfigViewAPI } from "@/api/vr-game/get";
import { updateVrSportsConfig } from "@/api/vr-game/patch";
import SaveBtn from "@/components/SaveBtn";
import VrOptions from "../VrOptions.json";

interface FormProps {
  sportsNameKr: string;
  closeTime: string;
  closeMessage: string;
  order: string;
  status: string;
}

const VrSportsConfigEdit = () => {
  const [form] = Form.useForm<FormProps>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchView = async () => {
    if (!id) return;

    const res = await getVrSportsConfigViewAPI(id);

    if (res) {
      form.setFieldsValue({
        sportsNameKr: res.sports_name_kr,
        closeTime: res.close_time,
        closeMessage: res.close_message,
        order: res.order,
        status: res.status,
      });
    }
  };

  useEffect(() => {
    fetchView();
  }, []);

  const handleSubmit = async (e: any) => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await updateVrSportsConfig({
        id,
        closeTime: e.closeTime,
        closeMessage: e.closeMessage,
        order: e.order,
        status: e.status,
      });

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchView();
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
        <Breadcrumb replace={i18next.t("vrCfg.sportEdit")} />
      </Space>
      <Divider />
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item label={i18next.t("col.sport")} shouldUpdate>
              {() => {
                const value = form.getFieldValue("sportsNameKr");

                return <span>{value}</span>;
              }}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("userGameSettings.orderPlaceholder")} name={"order"}>
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.maintenanceMessage")} name={"closeMessage"}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.deadline")} name={"closeTime"}>
              <Input type="number" addonAfter={i18next.t("unit.sec")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18next.t("col.status")} name={"status"}>
              <Radio.Group
                name="statusradiogroup"
                defaultValue={1}
                options={VrOptions.statusOptions}
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

export default VrSportsConfigEdit;
