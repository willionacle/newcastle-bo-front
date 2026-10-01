import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import MissionCouponForm from "./MissionCouponForm";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MissionCouponCreate = () => {
  const { t } = useTranslation();
  const { type }= useParams();

  return (
    <Card>
      <Breadcrumb replace={type === 'mission' ? t("event.missionCreate") : t("event.missionCouponCreate")} />
      <Divider />

      <MissionCouponForm />
    </Card>
  );
};

export default MissionCouponCreate;
