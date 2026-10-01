import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import StreamEventForm from "./StreamEventForm";
import { useEffect, useState } from "react";
import { EventItem, getSceventApi } from "@/api/stream-community-event/get";

const StreamEventEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);

  useEffect(() => {

    const fetchEvent = async () => {
      try {
        const data = await getSceventApi(id);
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event:", err);
      }
    };

    fetchEvent();
  }, [id]);

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm037")} />
      <Divider />
      <StreamEventForm data={event}/>
    </Card>
  );
};

export default StreamEventEdit;
