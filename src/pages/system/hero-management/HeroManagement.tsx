import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import CreateBtn from "@/components/CreateBtn";
import { heroManagementAPI } from "@/api/hero-management/get";

const HeroManagement = () => {
  const { swr, onHeaderCell, paginationProps } = heroManagementAPI();

  return (
    <Card>
      <Space>
        <Breadcrumb />
        <CreateBtn />
      </Space>
      <Divider />
      <List 
        data={swr.data?.data}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default HeroManagement;
