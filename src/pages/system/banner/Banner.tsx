import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import CreateBtn from "@/components/CreateBtn";
import { getBannerAPI } from "@/api/banners/get";

const Banner = () => {
  const { swr, paginationProps } = getBannerAPI();

  return (
    <Card>
      <Space>
        <Breadcrumb />
        <CreateBtn />
      </Space>
      <Divider />
      <List 
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
        />
    </Card>
  );
};

export default Banner;
