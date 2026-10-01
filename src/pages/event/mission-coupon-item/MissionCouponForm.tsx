import i18next from "@/i18n/i18n";
import { useEffect } from "react";
import { Form, Input, InputNumber, notification, Switch } from "antd";
import SaveBtn from "@/components/SaveBtn";
import { DefaultOptionType } from "antd/es/select";
import { Select } from "antd/lib";
import { useNavigate, useParams } from "react-router-dom";
import { createMissionCouponAPI } from "@/api/daily-mission/mission-coupon/post";
import { updateMissionCouponAPI } from "@/api/daily-mission/mission-coupon/put";
import { MissionCouponItem } from "@/api/daily-mission/mission-coupon/get";

interface FormData {
  coupon_name: string;
  coupon_content: string;
  name: string;
  mission_type: DefaultOptionType;
  amount: number;
  percentage: number;
  coupon_amount: number;
  coupon_percentage: number;
  is_active: boolean;
  is_used: boolean;
}

const MissionTypeOption: DefaultOptionType[] = [
  { label: i18next.t("mission.casinoBet"), value: 'liveBetting' },
  { label: i18next.t("mission.slotBet"), value: 'slotBetting' },
  { label: i18next.t("mission.sportsBet"), value: 'sportsBetting' },
  { label: i18next.t("mission.minigameBet"), value: 'minigameBetting' },
  { label: i18next.t("mission.virtualSportsBet2"), value: 'virtualSportsBetting' },
  { label: i18next.t("mission.fishingBet"), value: 'fishBetting' },
  { label: i18next.t("mission.buffaloBet"), value: 'buffaloMinigameBetting' },
  { label: i18next.t("mission.bitMatchBet"), value: 'btmtMinigameBetting' },
  { label: i18next.t("mission.combinedBet"), value: 'comprehensiveBetting' },
  { label: i18next.t("col.deposit"), value: 'deposit' }, 
  { label: i18next.t("mission.manual"), value: 'manual' },
];
interface Props {
  data?: MissionCouponItem;
}

const MissionCouponForm = ({ data }: Props) => {
  const [form] = Form.useForm<FormData>();
  const { id, type } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    
    const {
      name,
      amount,
      mission_type,
      coupon_name,
      coupon_amount,
      coupon_percentage,
      is_active,
      coupon_content,
    } = e;

    const reqBody = {
      id: id ? parseInt(id) : undefined,
      name: name,
      coupon_name: coupon_name,
      amount: amount,
      // "percentage"    : percentage,
      "percentage"    : 0,
      coupon_amount: coupon_amount ?? 0,
      coupon_percentage: coupon_percentage ?? 0,
      is_active: type === "coupon" ? undefined : is_active ? 1 : 0,
      is_used: type === "coupon" ? 0 : undefined,
      mission_type:
        type === "mission"
          ? (mission_type?.label as string) ?? null
          : undefined,
      function_name:
        type === "mission"
          ? (mission_type?.value as string) ?? null
          : undefined,
      coupon_content: type === "coupon" ? coupon_content : undefined,
    };

    console.log("REQ BODY", reqBody);

    try {
      if (id) {
        const res = await updateMissionCouponAPI(type, reqBody);
        const {
          data: { code, message },
        } = res;
        if (code == 0) {
          notification.success({ message: message });
          navigate(`/event/mission-coupon-setting/${type}`);
        } else {
          notification.error({ message: message });
        }
      } else {
        const res = await createMissionCouponAPI(type, reqBody);
        const {
          data: { code, message },
        } = res;
        if (code == 0) {
          notification.success({ message: message });
          navigate(`/event/mission-coupon-setting/${type}`);
        } else {
          notification.error({ message: message });
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(data);
    if (data) {
      const formData = data as unknown as FormData;
      const { mission_type, function_name } = data;

      form.setFieldsValue({
        ...formData,
        mission_type: { label: mission_type, value: function_name },
      });
    }
  }, [data]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label={type === "mission" ? i18next.t("col.name") : i18next.t("coupon.cp008")}
        name={type === "mission" ? "name" : "coupon_name"}
        rules={[{ required: true }]}
      >
        <Input type="text" size="small" />
      </Form.Item>
      {type === "mission" && (
        <Form.Item
          label={i18next.t("event.missionType")}
          name={"mission_type"}
          rules={[{ required: true }]}
        >
          <Select
            size="small"
            options={MissionTypeOption}
            style={{ width: "100%" }}
            labelInValue
            allowClear
          />
        </Form.Item>
      )}
        <Form.Item
          label={type === 'mission' ? i18next.t("mission.clearAmountOrAction") : i18next.t("col.amount")}
          name={type === 'mission' ? "amount" : "coupon_amount"}
          rules={[{ required: true }]}
        >
          <InputNumber
            controls={false}
            size="small"
            style={{ width: "100%" }}
          />
        </Form.Item>
      {/* <Form.Item 
        label={'백분율'}
        name={type === 'mission' ? "percentage" : "coupon_percentage"}
        rules={[{ required: true }]}
      >
        <InputNumber suffix="%" controls={false} size="small" min={0} max={100} style={{width: '100%'}} />
      </Form.Item> */}
      {type === "mission" && (
        <Form.Item
          label={i18next.t("col.status")}
          name={"is_active"}
          initialValue={true}
          rules={[{ required: true }]}
        >
          <Switch />
        </Form.Item>
      )}
      {type === "coupon" && (
        <Form.Item
          label={i18next.t("col.couponContent")}
          name={"coupon_content"}
          rules={[{ required: true }]}
          initialValue={i18next.t("mission.missionOnlyCoupon")}
        >
          <Input type="text" size="small" />
        </Form.Item>
      )}
      <SaveBtn />
    </Form>
  );
};

export default MissionCouponForm;
