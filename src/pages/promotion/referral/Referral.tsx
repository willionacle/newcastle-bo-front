import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import ReferralConfig from "./ReferralConfig";

const Referral = () => {
  return (
    <Card>
      <Breadcrumb replace={i18next.t("referralCfg.title")}/>
      <Divider />
      <ReferralConfig />
    </Card>
  );
};

export default Referral;
