import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import { LevelConfigData } from "@/api/level-configs/get";
import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  notification,
} from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface Props {
  data: LevelConfigData | undefined;
}

interface FormData {
  deposit_required: string;
  level: string;
  level_up_mileage: string;
  maximum_lossing_amount: string;
  mileage_percentage: string;
  rolling_casino_percentage: string;
  rolling_mini_game_percentage: string;
  rolling_required: string;
  rolling_slot_percentage: string;
  rolling_sports_percentage: string;
  weekly_lossing_percentage: string;
}

const LevelForm = ({ data }: Props) => {
  const {token, userid} = useUserStore.getState()
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    console.log('FORM', e)
    const body = {
      userid: userid,
      level: Number(e.level),
      deposit_required: Number(e.deposit_required),
      level_up_mileage: Number(e.level_up_mileage),
      maximum_lossing_amount: Number(e.maximum_lossing_amount),
      mileage_percentage: Number(e.mileage_percentage) / 100,
      rolling_casino_percentage: Number(e.rolling_casino_percentage) / 100,
      rolling_mini_game_percentage: Number(e.rolling_mini_game_percentage) / 100,
      rolling_slot_percentage: Number(e.rolling_slot_percentage) / 100,
      rolling_sports_percentage: Number(e.rolling_sports_percentage) / 100,
      rolling_required: Number(e.rolling_required),
      weekly_lossing_percentage: Number(e.weekly_lossing_percentage) / 100,
    };
    console.log('REQ DATA', body)
    try {
      if (data) {

        const res = await api.updateLevel({...body, id: data.id}, token)
        console.log(res)
        const {data: {code, message}} = res

        if(code === 0) {
            notification.success({
              message: i18next.t("toast.common.updateSuccess"),
            });

            navigate(-1);
        } else {
          notification.success({
            message: message,
          });
        }
      } else {
        const res = await api.createLevel(body, token)
        console.log(res)
        const {data: {code, message}} = res

        if(code === 0) {
            notification.success({
              message: i18next.t("toast.common.createSuccess"),
            });

            navigate(-1);
        } else {
          notification.success({
            message: message,
          });
        }
      }
    } catch (error: any) {
      notification.error({
        message: error.response.data.error.message ?? i18next.t("global.fail"),
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      level: data?.level.toString(),
      rolling_casino_percentage: data?.rolling_casino_percentage
        ? (data.rolling_casino_percentage * 100).toPrecision(2)
        : "",
      rolling_slot_percentage: data?.rolling_slot_percentage
        ? (data.rolling_slot_percentage * 100).toPrecision(2)
        : "",
      rolling_mini_game_percentage: data?.rolling_mini_game_percentage
        ? (data.rolling_mini_game_percentage * 100).toPrecision(2)
        : "",
      rolling_sports_percentage: data?.rolling_sports_percentage
        ? (data.rolling_sports_percentage * 100).toPrecision(2)
        : "",
      deposit_required: data?.deposit_required,
      rolling_required: data?.rolling_required,
      weekly_lossing_percentage: data?.weekly_lossing_percentage
        ? (data.weekly_lossing_percentage * 100).toPrecision(2)
        : "",
      maximum_lossing_amount: data?.maximum_lossing_amount,
      mileage_percentage: data?.mileage_percentage
        ? (data.mileage_percentage * 100).toPrecision(2)
        : "",
      level_up_mileage: data?.level_up_mileage,
    });
  }, [data]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col span={12}>
          <Form.Item label={t("levelSetting.lvs002")} name={"level"}>
            <Input type="number" disabled={data ? true : false} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("levelSetting.lvs005")}
            name={"rolling_casino_percentage"}
          >
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("levelSetting.lvs005-1")}
            name={"rolling_slot_percentage"}
          >
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("levelSetting.lvs005-2")}
            name={"rolling_sports_percentage"}
          >
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("levelSetting.lvs005-3")}
            name={"rolling_mini_game_percentage"}
          >
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={t("levelSetting.lvs003")} name={"deposit_required"}>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={t("levelSetting.lvs004")} name={"rolling_required"}>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("levelSetting.lvs007")}
            name={"weekly_lossing_percentage"}
          >
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("levelSetting.lvs008")}
            name={"maximum_lossing_amount"}
          >
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("levelSetting.lvs011")}
            name={"mileage_percentage"}
          >
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={t("levelSetting.lvs012")} name={"level_up_mileage"}>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider />
      <SaveBtn />
    </Form>
  );
};

export default LevelForm;
