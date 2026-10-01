import Breadcrumb from "@/components/Breadcrumb";
import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { getEventAPI } from "@/api/event/get";

const Event = () => {
  const { swr, onHeaderCell, paginationProps } = getEventAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb />
        <CreateBtn />
      </Space>

      <Divider />

      <List
        data={swr.data ? swr.data.data : undefined}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default Event;
