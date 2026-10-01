import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import BannerForm from "./BannerForm";
import { useParams } from "react-router-dom";
import useGetItemData from "@/hooks/useGetItemData";
import { useEffect } from "react";

const BannerEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {data, getItem} = useGetItemData({
    id: id
  }, 'getBanner')

  useEffect(() => {
    getItem()
  }, [])

  return (
    <Card>
      <Breadcrumb replace={t("bannerDetail.bnr005")} />
      <Divider />

      <BannerForm data={data} />
    </Card>
  );
};

export default BannerEdit;
