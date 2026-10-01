import i18next from "@/i18n/i18n";
import { findUVAccountAPI } from "@/api/uv-account/get";
import { craeteUVAccount } from "@/api/uv-account/post";
import { updateUVAccount } from "@/api/uv-account/put";
import Breadcrumb from "@/components/Breadcrumb";
import SaveBtn from "@/components/SaveBtn";
import { Card, Divider, Form, Input, notification, Select } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
  id?: number
  type: string
  title: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

const VirtualAccountForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data } = findUVAccountAPI(id);

  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    console.log(e)
    if (id) {
      try {
        const res = await updateUVAccount({
          ...e, 
          id: parseInt(id),
          reg_type: 0,
          reg_level: null,
          reg_grade: null,
          reg_excel: null,
        })
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
    } else {
      try {
        const res = await craeteUVAccount({
          ...e, 
          reg_type: 0,
          reg_level: null,
          reg_grade: null,
          reg_excel: null,
        })
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
    }
  };

  useEffect(() => {
    if (data && id) {
      form.setFieldsValue({
        type: data.type,
        title: data.title,
        bank_name: data.bank_name,
        account_name: data.account_name,
        account_number: data.account_number,
      });
    }
  }, [data]);

  return (
    <Card>
      <Breadcrumb
        replace={data ? i18next.t("system.editVirtualDeposit", { type: id ? data.type : '' }) : i18next.t("system.createVirtualAccountDeposit")}
      />
      <Divider />

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item label={t("col.accountName")} name={"type"} required>
          <Select size="small">
            <Select.Option value="v-account1">{i18next.t("payment.virtualAccount1")}</Select.Option>
            <Select.Option value="v-account2">{i18next.t("payment.virtualAccount2")}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={t("col.title")} name={"title"} required>
          <Input />
        </Form.Item>
        <Form.Item label={t("col.bank")} name={"bank_name"} required>
          <Input />
        </Form.Item>

        <Form.Item label={t("col.accountNumber")} name={"account_number"} required>
          <Input />
        </Form.Item>

        <Form.Item label={t("col.accountHolder")} name={"account_name"} required>
          <Input />
        </Form.Item>

        <Divider />

        <SaveBtn />
      </Form>
    </Card>
  );
};

export default VirtualAccountForm;
