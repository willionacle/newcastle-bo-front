import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import LevelForm from "./LevelForm";
import useGetItemData from "@/hooks/useGetItemData";
import { useEffect } from "react";

const LevelEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  // const { swr } = findLevelConfigAPI(id);

  const {data, getItem} = useGetItemData({
    id: id
  }, 'getLevel')

  useEffect(() => {
    getItem()
  }, [])

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm021-1")} />
      <Divider />
      <LevelForm data={data} />
    </Card>
  );
};

export default LevelEdit;
