import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import MessageTemplateForm from "./MessageTemplateForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useGetItemData from "@/hooks/useGetItemData";

const MessageTemplateEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const {data, getItem} = useGetItemData({
    id: id
  }, 'getMessageTemplate')

  useEffect(() => {
    getItem()
  }, [])

  return (
    <Card>
      <Breadcrumb replace={t("messageDetail.msgr001")} />
      <Divider />
      <MessageTemplateForm data={data} tempMessage={data ? JSON.parse(data?.message) : undefined} />
    </Card>
  );
};

export default MessageTemplateEdit;
