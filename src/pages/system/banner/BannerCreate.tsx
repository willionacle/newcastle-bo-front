import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import BannerForm from "./BannerForm";

const BannerCreate = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("bannerDetail.bnr001")} />
      <Divider />

      <BannerForm />
    </Card>
  );
};

export default BannerCreate;
