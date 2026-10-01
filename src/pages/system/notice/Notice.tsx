import Breadcrumb from "@/components/Breadcrumb";
import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { noticeAPI } from "@/api/notice/get";

const Notice = () => {
  const { swr, onHeaderCell, paginationProps } = noticeAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb />
        <CreateBtn />
      </Space>
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default Notice;
