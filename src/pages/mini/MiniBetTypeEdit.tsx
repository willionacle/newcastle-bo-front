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
import { getMiniBetTypeViewAPI } from "@/api/mini-game/get";
import { updateMiniBetType } from "@/api/mini-game/patch";
import SaveBtn from "@/components/SaveBtn";
import MiniOptions from "./MiniOptions.json";

interface FormProps {
  game: string;
  name: string;
  odds: string;
  status: string;
  order: string;
}

const MiniBetTypeEdit = () => {
  const [form] = Form.useForm<FormProps>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchView = async () => {
    if (!id) return;

    const res = await getMiniBetTypeViewAPI(id);

    if (res) {
      form.setFieldsValue({
        game: res.game,
        name: res.name,
        odds: res.odds,
        status: res.status,
        order: res.order,
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

      const res = await updateMiniBetType({
        id,
        name: e.name,
        odds: e.odds,
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
        <Breadcrumb replace={i18next.t("miniCfg.betEdit")} />
      </Space>
      <Divider />
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item label={i18next.t("memberDetail.mis051")} shouldUpdate>
              {() => {
                const gameMap: Record<string, string> = {
                  coin_powerball: i18next.t("miniCfg.coinPowerball"),
                  coin_ladder: i18next.t("miniCfg.coinLadder"),
                  eos_powerball: i18next.t("miniCfg.eosPowerball"),
                };
                const value = form.getFieldValue("game");

                return <span>{gameMap[value] || value}</span>;
              }}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.betName")} name={"name"}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("col.odds")} name={"odds"}>
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("userGameSettings.orderPlaceholder")} name={"order"}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18next.t("col.status")} name={"status"}>
              <Radio.Group
                name="statusradiogroup"
                defaultValue={1}
                options={MiniOptions.statusOptions}
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

export default MiniBetTypeEdit;
