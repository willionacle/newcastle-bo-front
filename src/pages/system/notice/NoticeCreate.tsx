import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import NoticeForm from "./NoticeForm";
import { useParams } from "react-router-dom";
import useGetItemData from "@/hooks/useGetItemData";
import { useEffect } from "react";

const NoticeCreate = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {data, getItem} = useGetItemData({
    id: id
  }, 'getNotice')

  useEffect(() => {
    getItem()
  }, [])

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm039")} />
      <Divider />

      <NoticeForm data={data} content={data ? JSON.parse(data.content) : undefined} />
    </Card>
  );
};

export default NoticeCreate;
