import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import useGetItemData from "@/hooks/useGetItemData";
import { useEffect } from "react";
import RegulationForm from "./RegulationForm";

const RegulationCreate = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {data, getItem} = useGetItemData({
    id: id
  }, 'getRegulation')

  useEffect(() => {
    getItem()
  }, [])

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm069")} />
      <Divider />
    
      <RegulationForm data={data} content={data ? JSON.parse(data.content) : undefined} />
    </Card>
  );
};

export default RegulationCreate;
