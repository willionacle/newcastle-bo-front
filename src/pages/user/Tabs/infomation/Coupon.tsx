import i18next from "@/i18n/i18n";
import { createCoupon } from "@/api/coupon/post";
import { ResUser } from "@/api/types";
import { User } from "@/api/users/get";
import CouponNameSelect from "@/components/CouponNameSelect";

import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";
import { Col, DatePicker, Form, Input, InputNumber, Row, notification } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: ResUser['data'] | undefined;
  mutate: KeyedMutator<User>;
}

interface FormData {
  amount: string;
  coupon_name: any;
  system_note: string;
  expired_date: any;
  user: string;
}

const Coupon = ({ data, mutate }: Props) => {
  const {userid} = useUserStore.getState()
  const { t } = useTranslation();
  const { username } = data ?? {};
  const [form] = Form.useForm<FormData>();

  const handleSubmit = async (e: FormData) => {
    try {
      if (e.expired_date) {
        if (
          await createCoupon({
            // name: e.name,
            // amount: Number(e.amount),
            // expiredDate: e.expired_date.toISOString(),
            // systemNote: e.systemNote,
            // user: [e.user],
            // group: null,

            "userid"                        : userid,
            "username"                      : [e.user],
            "coupon_name"                   : e.coupon_name?.label,
            "system_note"                   : e.system_note,
            "amount"                        : Number(e.amount),
            "is_used"                       : 0,
            "expired_date"                  : GF.formatDate(e.expired_date?.toISOString(), false)
          })
        ) {
          notification.success({
            message: i18next.t("toast.coupon.issueComplete"),
          });
          form.resetFields();
        }
      }
    } catch (error) {
      notification.error({
        message: i18next.t("toast.coupon.issueFailed"),
      });
    } finally {
      mutate();
    }
  };

  useEffect(() => {
    if (username) {
      form.setFieldValue("user", username);
    }
  }, [username]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col
          span={24}
          // style={{ background: "var(--ant-color-fill-secondary)" }}
        >
          <Form.Item
            name={"amount"}
            label={t("memberDetail.mis112")}
            rules={[{ required: true }]}
          >
            <InputNumber
              size="small"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <CouponNameSelect label={t("memberDetail.mis092")} required={true} />
        </Col>

        <Col span={24}>
          <Form.Item
            name={"system_note"}
            label={t("memberDetail.mis090")}
            rules={[{ required: true }]}
          >
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label={t("couponDetail.cpre001")}
            rules={[{ required: true }]}
            name={"expired_date"}
            initialValue={dayjs().tz().add(7, "day")}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          {/* <DateRange
            label="couponDetail.cpre001"
            required
            initialValue={[dayjs().tz(), dayjs().tz().add(7, "day")]}
          /> */}
        </Col>

        <Col span={24} style={{ alignSelf: "center" }}>
          <SaveBtn block size="small" />
        </Col>

        <Col span={24}>
          <Form.Item
            name={"user"}
            label={t("couponDetail.cpre002")}
            rules={[{ required: true }]}
            initialValue={username ?? ""}
            hidden
          >
            <Input size="small" disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Coupon;
