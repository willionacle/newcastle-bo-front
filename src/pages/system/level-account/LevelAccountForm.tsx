import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import Breadcrumb from "@/components/Breadcrumb";
import LevelSelector from "@/components/LevelSelector";
import SaveBtn from "@/components/SaveBtn";
import useGetItemData from "@/hooks/useGetItemData";
import useUserStore from "@/store/user.store";
import { Card, Divider, Form, Input, notification } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
  id? :number
  level :number
  bank_name: string;
  account_number: string;
  account_name: string;
}

const LevelAccountForm = () => {
  const {token, userid} = useUserStore.getState()
  const { t } = useTranslation();
  const { id } = useParams();
  const {data, getItem} = useGetItemData({
    id: id
  }, 'getLevelDeposit')

  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    console.log(e)
    if (id) {
      try {
        const res = await api.updateLevelDeposit({...e, id: Number(id), userid: userid}, token)
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
        const res = await api.createLevelDeposit({...e, type: 'level', userid: userid}, token)
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
    getItem()
  }, [])

  useEffect(() => {
    // if(id) {
    //   getItem()
    // }
    if (data) {
      form.setFieldsValue({
        level: data.level,
        bank_name: data.bank_name,
        account_name: data.account_name,
        account_number: data.account_number,
      });
    }
  }, [data]);

  return (
    <Card>
      <Breadcrumb
        replace={data ? i18next.t("system.editLevelAccount", { level: data.level }) : i18next.t("system.createLevelAccount")}
      />
      <Divider />

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <LevelSelector />
        <Form.Item label={t("col.bank")} name={"bank_name"}>
          <Input />
        </Form.Item>

        <Form.Item label={t("col.accountNumber")} name={"account_number"}>
          <Input />
        </Form.Item>

        <Form.Item label={t("col.accountHolder")} name={"account_name"}>
          <Input />
        </Form.Item>

        <Divider />

        <SaveBtn />
      </Form>
    </Card>
  );
};

export default LevelAccountForm;
