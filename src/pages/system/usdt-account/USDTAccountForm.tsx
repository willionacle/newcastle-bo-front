import i18next from "@/i18n/i18n";
import { findUVAccountAPI } from "@/api/uv-account/get";
import { craeteUVAccount } from "@/api/uv-account/post";
import { updateUVAccount } from "@/api/uv-account/put";
import Breadcrumb from "@/components/Breadcrumb";
import CustomUpload from "@/components/CustomUpload";
import GradeCheckbox from "@/components/GradeCheckbox";
import SaveBtn from "@/components/SaveBtn";
import UserLevelCheckBox from "@/components/UserLevelCheckBox";
import { Card, Col, Divider, Form, Input, notification, Row, Select } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
  id?: number
  title: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  reg_type: number;
  reg_level: string | null;
  reg_grade: string | null;
  reg_excel: string | null;
}

const USDTAccountForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data } = findUVAccountAPI(id);

  const [form] = Form.useForm<FormData>();
  const regType = Form.useWatch('reg_type', form);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    
    const reqBody = {
      ...e,
      reg_level: e.reg_level && e.reg_type == 1 ? JSON.stringify(e.reg_level) : null,
      reg_grade: e.reg_grade && e.reg_type == 2 ? JSON.stringify(e.reg_grade) : null,
      reg_excel: e.reg_excel && e.reg_type == 3 ? e.reg_excel : null,
    }
    console.log(reqBody)
    if (id) {
      try {
        const res = await updateUVAccount({
          ...reqBody, 
          id: parseInt(id),
          type: 'usdt',
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
          ...reqBody, 
          type: 'usdt',
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
        title: data.title,
        bank_name: data.bank_name,
        account_name: data.account_name,
        account_number: data.account_number,
        reg_type: data.reg_type,
        reg_level: data.reg_level ? JSON.parse(data.reg_level) : undefined,
        reg_grade: data.reg_grade ? JSON.parse(data.reg_grade) : undefined,
        reg_excel: data.reg_excel,
      });
    }
  }, [data]);

  return (
    <Card>
      <Breadcrumb
        replace={data ? i18next.t("system.editUsdtDeposit", { type: id ? data.type : '' }) : i18next.t("system.createUsdtDepositSetting")}
      />
      <Divider />

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* <Form.Item label={t("col.accountName")} name={"type"} required>
          <Select size="small">
            <Select.Option value="v-account1">가상계좌1</Select.Option>
            <Select.Option value="v-account2">가상계좌2</Select.Option>
          </Select>
        </Form.Item> */}
        <Row gutter={[40, 16]} align={'stretch'}>
          <Col span={8}>
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
          </Col>
          <Col span={'auto'} style={{borderLeft: '1px solid var(--ant-color-border-secondary)'}}>
            <Form.Item label={t("col.category")} name={"reg_type"} initialValue={1} required>
              <Select size="small">
                <Select.Option value={1}>{i18next.t("col.level")}</Select.Option>
                <Select.Option value={2}>{i18next.t("col.grade")}</Select.Option>
                <Select.Option value={3}>Excel</Select.Option>
              </Select>
            </Form.Item>
            {regType === 1 && (
              <UserLevelCheckBox label={i18next.t("col.level")} name="reg_level" hideAll />
            )}
            {regType === 2 && (
              <GradeCheckbox label={i18next.t("col.grade")} name="reg_grade" hideAll />
            )}
            {regType === 3 && (
              <Form.Item label={"Excel"} name={"reg_excel"}>
                <CustomUpload type={"reg_excel"} accept=".xlsx,.xls" />
              </Form.Item>
            )}
            
          </Col>
        </Row>
        
        <Divider />

        <SaveBtn />
      </Form>
    </Card>
  );
};

export default USDTAccountForm;
