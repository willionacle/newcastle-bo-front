import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import HeroManagementForm from "./HeroManagementForm";
import { useParams } from "react-router-dom";
import useGetItemData from "@/hooks/useGetItemData";
import { useEffect } from "react";

const HeroManagementEdit = () => {
  const { id } = useParams();

  const {data, getItem} = useGetItemData({
    id: id
  }, 'getHero')

  useEffect(() => {
    getItem()
  }, [])

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <HeroManagementForm data={data} />
    </Card>
  );
};

export default HeroManagementEdit;
