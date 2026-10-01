import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import MessageForm from "./MessageForm";

const MessageCreate = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("messageDetail.msgr001")} />
      <Divider />
      <MessageForm />
    </Card>
  );
};

export default MessageCreate;
