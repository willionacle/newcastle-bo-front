import i18next from "@/i18n/i18n";
import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  Space,
  notification,
  Divider,
  Select,
} from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  createDepositMethod,
  CreateDepositMethodParams,
} from "@/api/deposit-method/post";
import Breadcrumb from "@/components/Breadcrumb";
import SaveBtn from "@/components/SaveBtn";

const DepositMethodCreate = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const params: CreateDepositMethodParams = {
        type: values.type,
        title: values.title,
        displayName: values.displayName,
        status: values.status ? 1 : 0,
        isInput: values.isInput ? 1 : 0,
        bankName: values.bankName || undefined,
        accountNumber: values.accountNumber || undefined,
        accountName: values.accountName || undefined,
        memo: values.memo || undefined,
        showMemo: values.showMemo || 0,
      };

      const response = await createDepositMethod(params);

      if (response.code === 0) {
        notification.success({
          message: t("toast.depositMethod.createSuccess"),
        });
        navigate("/payment/deposit-method");
      } else {
        // This handles backend errors like code 409
        notification.error({
          message: t("toast.depositMethod.createFailed"),
          description: response.message || t("toast.depositMethod.createFailedDesc"),
        });
      }
    } catch (error: any) {
      // This handles network/axios errors
      console.error("Create error:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorMsg =
          error.response.data.message || error.response.data.error?.message;
        notification.error({
          message: t("toast.depositMethod.createFailed"),
          description: errorMsg || t("toast.depositMethod.createFailedDesc"),
        });
      } else {
        notification.error({
          message: t("toast.depositMethod.createFailed"),
          description: error.message || t("toast.common.networkError"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/payment/deposit-method");
  };

  return (
    <Card>
      <Breadcrumb />
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: true,
          isInput: false,
          showMemo: 0,
        }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label={i18next.t("title.type")}
          name="type"
          rules={[
            { required: true, message: t("validation.enterType") },
            {
              pattern: /^\S*$/,
              message: t("validation.noWhitespace"),
            },
          ]}
        >
          <Input placeholder={i18next.t("depoMethod.egTypeCode")} />
        </Form.Item>

        <Form.Item
          label={i18next.t("title.backofficeDisplayName")}
          name="title"
          rules={[
            { required: true, message: t("validation.enterBackofficeName") },
          ]}
        >
          <Input placeholder={i18next.t("depoMethod.egBankKo")} />
        </Form.Item>

        <Form.Item
          label={i18next.t("title.userpageDisplayName")}
          name="displayName"
          rules={[
            { required: true, message: t("validation.enterUserpageName") },
          ]}
        >
          <Input placeholder={i18next.t("depoMethod.egBankEn")} />
        </Form.Item>

        <Form.Item
          label={i18next.t("depoMethod.statusDefault")}
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren={i18next.t("status.active")} unCheckedChildren={i18next.t("status.inactive")} />
        </Form.Item>

        <Form.Item
          label={i18next.t("depoMethod.inputAvailability")}
          name="isInput"
          valuePropName="checked"
          extra={i18next.t("depoMethod.inputAvailabilityDesc")}
        >
          <Switch checkedChildren={i18next.t("status.inputAllowed")} unCheckedChildren={i18next.t("status.inputNotAllowed")} />
        </Form.Item>

        <Divider orientation="left">{i18next.t("depoMethod.accountInfoOptional")}</Divider>

        <Form.Item label={i18next.t("col.bankName")} name="bankName">
          <Input placeholder={i18next.t("depoMethod.enterBankName")} />
        </Form.Item>

        <Form.Item label={i18next.t("col.accountNumber")} name="accountNumber">
          <Input placeholder={i18next.t("depoMethod.enterAccountNumber")} />
        </Form.Item>

        <Form.Item label={i18next.t("col.accountHolder")} name="accountName">
          <Input placeholder={i18next.t("depoMethod.enterAccountHolder")} />
        </Form.Item>

        <Divider orientation="left">{i18next.t("depoMethod.memoSettingOptional")}</Divider>

        <Form.Item label={i18next.t("col.memo")} name="memo">
          <Input.TextArea placeholder={i18next.t("depoMethod.enterMemo")} rows={3} />
        </Form.Item>

        <Form.Item
          label={i18next.t("depoMethod.memoDisplay")}
          name="showMemo"
          extra={i18next.t("depoMethod.memoDisplayDesc")}
        >
          <Select placeholder={i18next.t("depoMethod.selectMemoDisplay")}>
            <Select.Option value={1}>{i18next.t("userGameSettings.shown")}</Select.Option>
            <Select.Option value={0}>{i18next.t("userGameSettings.hidden")}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <SaveBtn loading={loading} />
            <Button onClick={handleCancel}>{i18next.t("global.cancel")}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DepositMethodCreate;
