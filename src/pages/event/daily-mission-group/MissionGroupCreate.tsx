import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import MissionGroupForm from "./MissionGroupForm";

const MissionGroupCreate = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("event.missionGroupCreate")} />
      <Divider />

      <MissionGroupForm />
    </Card>
  );
};

export default MissionGroupCreate;
