import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getMissionGroupAPI } from "@/api/daily-mission/get";
import MissionGroupForm from "./MissionGroupForm";

const MissionGroupEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { swr } = getMissionGroupAPI(id);

  return (
    <Card>
      <Breadcrumb replace={t("event.missionGroupEdit")} />
      <Divider />
      {swr && !swr.isLoading && (
        <MissionGroupForm data={swr.data} />
      )}
    </Card>
  );
};

export default MissionGroupEdit;
