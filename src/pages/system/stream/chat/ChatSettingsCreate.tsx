import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import ChatSettingsForm from "./ChatSettingsForm";

const ChatSettingsCreate = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("col.registerBannedWord")} />
      <Divider />

      <ChatSettingsForm />
    </Card>
  );
};

export default ChatSettingsCreate;
