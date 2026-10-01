import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import { PostAddDepositBonus, PostGetDepBonusRes } from "@/api/types";
import LevelSelector from "@/components/LevelSelector";
import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Switch,
  notification,
} from "antd";
import { CSSProperties, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormProps {
  bonus_name: string;
  bonus_percentage: number;
  withdrawal_rolling: number;
  min_deposit: number;
  max_amount: number;
  level: number;
  in_use: boolean;
  temp_order: number;
  daily_limit: number;
  system_note: string;
  bonus_group: string;
}

interface Props {
  data?: PostGetDepBonusRes['data'];
}

const DepositBonusForm = ({ data }: Props) => {
  const {token, userid} = useUserStore.getState()
  const { t } = useTranslation();
  const [form] = Form.useForm<FormProps>();
  const inputStyle: CSSProperties = { width: "100%" };
  const navigate = useNavigate();

  const handleSubmit = async (e: FormProps) => {
    const {
      level,
      bonus_name,
      bonus_percentage,
      in_use,
      max_amount,
      min_deposit,
      withdrawal_rolling,
      temp_order,
      daily_limit,
      system_note,
      bonus_group,
    } = e;

    const bodyData: PostAddDepositBonus = {
      id: data ? data.id : undefined,
      userid: userid,
      available_level: level,
      bonus_group,
      bonus_name,
      bonus_percentage,
      in_use: in_use === true ? 1 : 0,
      max_amount,
      min_deposit,
      withdrawal_rolling,
      temp_order,
      daily_limit,
      system_note,
    };

    try {
      const res = await api[data ? 'updateDepositBonus' : 'createDepositBonus'](bodyData, token)
      const {data: {code, message}} = res

      if (code === 0) {
        notification.success({
          message: t("global.success"),
          type: "success",
        });
        navigate(-1);
      } else {
        notification.error({
          message: message,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        bonus_group: data.bonus_group,
        bonus_name: data.bonus_name,
        bonus_percentage: data.bonus_percentage,
        in_use: data.in_use,
        level: data.available_level,
        max_amount: data.max_amount,
        min_deposit: data.min_deposit,
        temp_order: data.temp_order,
        withdrawal_rolling: data.withdrawal_rolling,
        daily_limit: data.daily_limit ? data.daily_limit : undefined,
        system_note: data.system_note ?? "",
      });
    }
  }, [data]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe017")}
            name={"bonus_group"}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe001")}
            name={"bonus_name"}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe002")}
            name={"bonus_percentage"}
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              addonAfter="%"
              step={"0.01"}
              style={inputStyle}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe005")}
            name={"withdrawal_rolling"}
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              step={"0.01"}
              addonAfter="%"
              style={inputStyle}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe003")}
            name={"min_deposit"}
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              precision={0}
              style={inputStyle}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe004")}
            name={"max_amount"}
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              precision={0}
              style={inputStyle}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <LevelSelector all required />
        </Col>

        <Col span={8}>
          <Form.Item
            name={"temp_order"}
            label={i18next.t("col.displayOrder")}
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name={"daily_limit"} label={i18next.t("col.dailyPayoutCount")}>
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name={"in_use"}
            label={t("depositBonusDetail.dbe016")}
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={"system_note"} label={i18next.t("col.remarks")}>
            <Input allowClear />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <SaveBtn />
    </Form>
  );
};

export default DepositBonusForm;
