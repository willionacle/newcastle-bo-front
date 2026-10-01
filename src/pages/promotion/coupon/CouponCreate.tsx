import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import CouponForm from "./CouponForm";

const CouponCreate = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("couponDetail.cpre003")} />
      <Divider />
      <CouponForm />
    </Card>
  );
};

export default CouponCreate;
