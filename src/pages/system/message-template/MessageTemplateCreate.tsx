import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import MessageTemplateForm from "./MessageTemplateForm";

const MessageTemplateCreate = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("messageDetail.msgr001")} />
      <Divider />
      <MessageTemplateForm />
    </Card>
  );
};

export default MessageTemplateCreate;
