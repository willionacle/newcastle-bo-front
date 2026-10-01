import { useEffect, useState } from "react";
import i18next from "@/i18n/i18n";
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
import { getSportsBonusViewAPI } from "@/api/sports-list/get";
import { updateSportsBonusAPI } from "@/api/sports-list/patch";
import SaveBtn from "@/components/SaveBtn";

interface FormData {
  folderCount: number;
  odds: number;
  minOdds: number;
  errorMessage: string;
  status: number;
  homeName: string;
  awayName: string;
}

const SportsBonusEdit = () => {
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchView = async () => {
    if (!id) return;

    const res = await getSportsBonusViewAPI(id);

    if (res) {
      form.setFieldsValue({
        folderCount: res.folder_count,
        odds: res.odds,
        minOdds: res.min_odds,
        errorMessage: res.error_message,
        status: res.status,
        homeName: res.home_name,
        awayName: res.away_name,
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

      const res = await updateSportsBonusAPI({
        id,
        folderCount: e.folderCount,
        odds: e.odds,
        minOdds: e.minOdds,
        errorMessage: e.errorMessage,
        status: e.status,
        homeName: e.homeName,
        awayName: e.awayName,
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
        <Breadcrumb replace={i18next.t("sports.bonusEdit")} />
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
              label={i18next.t("col.home")}
              name={"homeName"}
              rules={[{ required: true, message: i18next.t("validation.enterHomeTeamName") }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("col.away")}
              name={"awayName"}
              rules={[{ required: true, message: i18next.t("validation.enterAwayTeamName") }]}
            >
              <Input />
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

export default SportsBonusEdit;
