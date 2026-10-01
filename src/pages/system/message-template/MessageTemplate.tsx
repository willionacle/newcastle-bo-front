import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import Btn from "@/components/Btn";
import { useNavigate } from "react-router-dom";
import { getMessageTemplateListAPI } from "@/api/message-template/get";

const MessageTemplate = () => {
  const navigate = useNavigate();
  const { swr, onHeaderCell, paginationProps } = getMessageTemplateListAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb />
        <Btn
          btnType="create"
          onClick={() => navigate("/system/message-template/create")}
        />
      </Space>
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        mutate={swr.mutate}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  );
};

export default MessageTemplate;
