import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import EventForm from "./EventForm";

const EventCreate = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm036")} />
      <Divider />

      <EventForm />
    </Card>
  );
};

export default EventCreate;
