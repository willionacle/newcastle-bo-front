import i18next from "@/i18n/i18n";
import { issueLuckyWheelCoupon } from "@/api/lucky-wheel/coupons";
import { CouponIssueBody } from "@/api/lucky-wheel/types";
import { ResUser, User } from "@/api/types";
import SaveBtn from "@/components/SaveBtn";
import { allowedAmounts, typeOptions } from "@/api/lucky-wheel/constants";
import { Col, DatePicker, Form, Input, notification, Row, Select, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";
import { GF } from "@/utils/GlobalFunctions";

interface Props {
  data: ResUser['data'] | undefined;
  mutate: KeyedMutator<User>;
}

// interface FormData {
//   amount: string;
//   type: any;
//   system_note: string;
//   expired_date: any;
//   username: string;
// }

interface FormData  {
  username: string[];
  grade: number;
  amount: number;
  expired_date: Dayjs;
  coupon_type: number;
  system_note: string;
}

const UserLuckyWheelForm = ({data, mutate}: Props) => {
  const { t } = useTranslation();
    const [form] = Form.useForm<FormData>();
    const couponType = Form.useWatch('coupon_type', form);
    // 날짜를 일수로 변환
    const calculateExpiredDays = (selectedDate: Dayjs): number => {
      const days = selectedDate.startOf('day').diff(dayjs().startOf('day'), 'days');
      if (days <= 0) {
        message.warning(t("toast.promotion.expiryAfterTomorrow"));
        return 1;
      }
      return days;
    };

    const handleSubmit = async (e: FormData) => {
      if (!data) return;

      const reqBody: CouponIssueBody = {
        username: data?.username,
        grade: e.grade,  // 폼에서 선택한 등급 사용
        couponType: e.coupon_type,
        amount: e.coupon_type == 2 ? 0 : e.amount,
        expiredDays: calculateExpiredDays(e.expired_date),
        systemNote: e.system_note
      }

      try {
        const res = await issueLuckyWheelCoupon(reqBody);
  
        const {code, message} = res.data
  
        if (code === 0) {
          notification.success({
            message: t("global.success"),
            type: "success",
          });
        } else {
          notification.error({
            message: message,
            type: "error",
          });
        }
      } catch (error) {
        console.error(error)
      } finally {
        mutate();
      }
    };
  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="grade"
              label={i18next.t("col.grade")}
              rules={[{ required: true, message: t("validation.selectGrade") }]}
              initialValue={data?.user_grade || 1}
            >
              <Select>
                {[1, 2, 3, 4, 5, 6, 7].map(grade => (
                  <Select.Option key={grade} value={grade}>
                    {GF.handleGradeStrVal(grade)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="coupon_type"
              label={i18next.t("title.type")}
              rules={[{ required: true }]}
              initialValue={1}
            >
              <Select options={typeOptions} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={t("col.amount")}
              name={"amount"}
              rules={[{ required: couponType !== 2, message: t("validation.selectAmount") }]}
            >
              <Select options={allowedAmounts} disabled={couponType == 2} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name={"system_note"}
              label={t("col.systemNote")}
              rules={[{ required: true }]}
              initialValue={i18next.t("col.luckyWheelCoupon")}
            >
              <Input size="small" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={t("col.validityPeriod")}
              rules={[{ required: true }]}
              name={"expired_date"}
              initialValue={dayjs().tz().add(7, "day")}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                placeholder={i18next.t("promotion.selectExpiry")}
                showToday={false}
              />
            </Form.Item>
          </Col>

      </Row>
        <SaveBtn />
    </Form>
  )
}

export default UserLuckyWheelForm