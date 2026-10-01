import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useParams } from "react-router-dom";
import MissionCouponForm from "./MissionCouponForm";
import { getDailyMissioCouponAPI } from "@/api/daily-mission/mission-coupon/get";
import { useTranslation } from "react-i18next";

const MissionCouponEdit = () => {
  const { t } = useTranslation();
  const { id, type } = useParams();
  const { swr } = getDailyMissioCouponAPI(type, id ? parseInt(id) : undefined);

  return (
    <Card>
      <Breadcrumb replace={type === 'mission' ? t("event.e05") : t("event.e06")} />
      <Divider />

      <MissionCouponForm data={swr.data && swr.data.data} />
    </Card>
  );
};

export default MissionCouponEdit;
