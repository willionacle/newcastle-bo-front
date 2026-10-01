import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { getMessageAPI } from "@/api/messages/get";
import Btn from "@/components/Btn";
import { useNavigate } from "react-router-dom";
import Filter from "./Filter";

const Message = () => {
  const navigate = useNavigate();
  const { swr, onHeaderCell, paginationProps, setFilters } = getMessageAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb />
        <Btn
          btnType="create"
          onClick={() => navigate("/system/message/create")}
        />
      </Space>
      <Divider />
        <Filter setBody={setFilters} />
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

export default Message;
