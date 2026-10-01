import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import EventForm from "./EventForm";
import useGetItemData from "@/hooks/useGetItemData";
import { useEffect } from "react";

const EventEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  // const { data } = findEventAPI(id);

  const {data, getItem} = useGetItemData({
    id: id
  }, 'getEvent')

  useEffect(() => {
    getItem()
  }, [])

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm037")} />
      <Divider />

      <EventForm data={data} />
    </Card>
  );
};

export default EventEdit;
