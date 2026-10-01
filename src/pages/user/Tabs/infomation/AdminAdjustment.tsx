import { User } from "@/api/users/get";
import { Col, Form, Input, InputNumber, notification, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { rowStyle } from "./AdminAdjustmentStyle";

import {
  AdminAdjustmentData,
  adjustBalance,
  adjustLossing,
  adjustRolling,
} from "@/api/point/adminAdjustment";
import { KeyedMutator } from "swr";
import SaveBtn from "@/components/SaveBtn";
import { ResUser } from "@/api/types";
import useUserStore from "@/store/user.store";

interface Props {
  data: ResUser['data'] | undefined;
  mutate: KeyedMutator<User>;
  type: string;
  onSuccess?:()=> void;
}

interface FormData extends AdminAdjustmentData {}

const AdminAdjustment = ({ data, mutate, type,onSuccess }: Props) => {
  const {userid} = useUserStore.getState();
  const { t } = useTranslation();
  const { balance, rolling_point, id, lossing_point } = data ?? {};
  const [form] = Form.useForm<FormData>();
  console.log('user adjustment', data)
  const handleSubmit = async (e: FormData) => {
    const { amount, system_note } = e;
    let res: any = null
    const bodyData = {
      userid    : userid,
      username  : data?.username,
      admin_id  : data?.agent_username,
      amount    : amount,
      system_note : system_note,
    };

    switch (type) {
      case "balance":
        res = await adjustBalance(bodyData, id);
        break;

      case "lossing":
        res =  await adjustLossing(bodyData, id)
        break;

      // case "mileage":
      //   if (await adjustMileage(bodyData, id)) {
      //     mutate();
      //   }
      //   break;

      case "rolling":
        res = await adjustRolling(bodyData, id)
        break;

      default:
        break;
    }

    console.log('adjustres',res)

    if (res.code == 0) {
      form.resetFields();
      mutate();
      onSuccess?.()
    } else {
      notification.error({message: res.message})
    }

  };

  return (
    <>
      <Row gutter={[16, 32]} style={{ ...rowStyle }}>
        {type === "balance" && (
          <Col span={24}>
            <Typography.Paragraph>
              {t("memberDetail.mis083")}
            </Typography.Paragraph>

            <Typography.Text className="ant-input-outlined ant-input ant-input-sm css-var-r1 ant-input-css-var">
              {balance ? balance.toLocaleString() : "-"}
            </Typography.Text>
          </Col>
        )}
        {type === "rolling" && (
          <Col span={24}>
            <Typography.Paragraph>
              {t("memberDetail.mis087")}
            </Typography.Paragraph>

            <Typography.Text className="ant-input-outlined ant-input ant-input-sm css-var-r1 ant-input-css-var">
              {rolling_point ? rolling_point.toLocaleString() : "-"}
            </Typography.Text>
          </Col>
        )}
        {type === "lossing" && (
          <Col span={24}>
            <Typography.Paragraph>{t("col.losingPoint")}</Typography.Paragraph>

            <Typography.Text className="ant-input-outlined ant-input ant-input-sm css-var-r1 ant-input-css-var">
              {lossing_point ? lossing_point.toLocaleString() : "-"}
            </Typography.Text>
          </Col>
        )}
      </Row>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row style={rowStyle} gutter={[16, 0]}>
          <Col
            span={24}
            // style={{
            //   background: "var(--ant-color-fill-secondary)",
            // }}
          >
            <Form.Item
              label={t("col.payoutRecoveryAmount")}
              name={"amount"}
              rules={[{ required: true }]}
            >
              <InputNumber
                size="small"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name={"system_note"}
              label={t("memberDetail.mis090")}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>

          <Col
            span={24}
            style={{
              alignSelf: "center",
            }}
          >
            <SaveBtn size="small" block />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AdminAdjustment;
