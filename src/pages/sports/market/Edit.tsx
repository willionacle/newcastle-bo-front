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
import { getSportsMarketViewAPI } from "@/api/sports-list/get";
import { updateSportsMarketAPI } from "@/api/sports-list/patch";
import SaveBtn from "@/components/SaveBtn";

interface FormProps {
  sportsNameKr: string;
  type: string;
  period: string;
  name: string;
  order: string;
  isCross: string;
  isWinlose: string;
  isHandicap: string;
  isSpecial: string;
  isInplay: string;
}

const SportsMarketEdit = () => {
  const [form] = Form.useForm<FormProps>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchView = async () => {
    if (!id) return;

    const res = await getSportsMarketViewAPI(id);

    if (res) {
      form.setFieldsValue({
        sportsNameKr: res.sports_name_kr,
        type: res.type,
        period: res.period,
        name: res.name,
        order: res.order,
        isCross: res.is_cross,
        isWinlose: res.is_winlose,
        isHandicap: res.is_handicap,
        isSpecial: res.is_special,
        isInplay: res.is_inplay,
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

      const res = await updateSportsMarketAPI({
        id,
        order: e.order,
        isCross: e.isCross,
        isWinlose: e.isWinlose,
        isHandicap: e.isHandicap,
        isSpecial: e.isSpecial,
        isInplay: e.isInplay,
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
        <Breadcrumb replace={i18next.t("sports.marketEdit")} />
      </Space>
      <Divider />
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item label={i18next.t("sports.sportType")} shouldUpdate>
              {() => <span>{form.getFieldValue("sportsNameKr")}</span>}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.marketType")} shouldUpdate>
              {() => <span>{form.getFieldValue("type")}</span>}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("sports.periodType")} shouldUpdate>
              {() => <span>{form.getFieldValue("period")}</span>}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.marketName")} shouldUpdate>
              {() => <span>{form.getFieldValue("name")}</span>}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.cross")} name={"isCross"}>
              <Radio.Group
                name="crossradiogroup"
                defaultValue={1}
                options={[
                  { value: 1, label: i18next.t("status.use") },
                  { value: 0, label: i18next.t("status.unused") },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.wdl")} name={"isWinlose"}>
              <Radio.Group
                name="winloseradiogroup"
                defaultValue={1}
                options={[
                  { value: 1, label: i18next.t("status.use") },
                  { value: 0, label: i18next.t("status.unused") },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.handicapTitle")} name={"isHandicap"}>
              <Radio.Group
                name="handicapradiogroup"
                defaultValue={1}
                options={[
                  { value: 1, label: i18next.t("status.use") },
                  { value: 0, label: i18next.t("status.unused") },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.special")} name={"isSpecial"}>
              <Radio.Group
                name="specialradiogroup"
                defaultValue={1}
                options={[
                  { value: 1, label: i18next.t("status.use") },
                  { value: 0, label: i18next.t("status.unused") },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("title.live")} name={"isInplay"}>
              <Radio.Group
                name="inplayradiogroup"
                defaultValue={1}
                options={[
                  { value: 1, label: i18next.t("status.use") },
                  { value: 0, label: i18next.t("status.unused") },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18next.t("userGameSettings.orderPlaceholder")} name={"order"}>
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <SaveBtn loading={loading} />
      </Form>
    </Card>
  );
};

export default SportsMarketEdit;
