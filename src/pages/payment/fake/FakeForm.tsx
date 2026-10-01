import i18next from "@/i18n/i18n";
import { findFakeWithdrawalAPI } from "@/api/fake-withdrawal/get";
import {
  CreateFakeWithdrawalBody,
  createFakeWithdrawal,
} from "@/api/fake-withdrawal/post";
import { updateFakeWithdrawal } from "@/api/fake-withdrawal/put";
import SaveBtn from "@/components/SaveBtn";
import { Divider, Form, Input, InputNumber, notification } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FakeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = findFakeWithdrawalAPI(id);
  const [form] = Form.useForm<CreateFakeWithdrawalBody>();

  const handleSubmit = async (e: CreateFakeWithdrawalBody) => {
    try {
      if (data) {
        if (await updateFakeWithdrawal(data.data.id.toString(), e)) {
          notification.success({ message: t("toast.common.saveSuccess") });
          navigate(-1);
        }
      } else {
        if (await createFakeWithdrawal(e)) {
          notification.success({ message: t("toast.common.saveSuccess") });
          navigate(-1);
        }
      }
    } catch (error: any) {
      notification.error({
        message: error.response.data.error.message ?? t("toast.common.saveFailed"),
      });
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        amount: data.data.amount,
        username: data.data.username,
      });
    }
  }, [data]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Form.Item label="ID" name={"username"} rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label={i18next.t("col.amount")} name={"amount"} rules={[{ required: true }]}>
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Divider />
      <SaveBtn />
    </Form>
  );
};

export default FakeForm;
