import Breadcrumb from "@/components/Breadcrumb";
import { Button, Card, Divider, Space } from "antd";
import { useTranslation } from "react-i18next";
import UserForm from "./UserForm";
import { useParams } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import useGetItemData from "@/hooks/useGetItemData";
import { useEffect } from "react";

const UserEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  // const { data, mutate } = findUsersAPI(id);

  const {data, getItem} = useGetItemData({
    id: id
  }, 'getUser')

  useEffect(() => {
    const s = setTimeout(() => {
      getItem();
    }, 1000);

    return () => {
      clearTimeout(s);
    }
  }, []); 

  return (
    <Card>
      <Space>
        <Breadcrumb replace={t("memberInfoEdit.mie000-2")} />
        <Button
          icon={<EyeOutlined />}
          shape="round"
          onClick={() => window.open(`/user/${id}`)}
        >
          상세보기
        </Button>
      </Space>
      <Divider />

      <UserForm user={data} mutate={getItem} />
    </Card>
  );
};

export default UserEdit;
