import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import CouponForm from "./CouponNameForm";
import { findCouponNameAPI } from "@/api/coupon-name/get";
import { useParams } from "react-router-dom";

const CouponNameCreate = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const  { data } = findCouponNameAPI(id)

  return (
    <Card>
      <Breadcrumb replace={ id ? t("couponDetail.cpre000-1") : t("couponDetail.cpre000-2")} />
      <Divider />
      <CouponForm data={data?.data} />
    </Card>
  );
};

export default CouponNameCreate;
