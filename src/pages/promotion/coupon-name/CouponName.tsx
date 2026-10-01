import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import CreateBtn from "@/components/CreateBtn";
import Filter from "./Filter";
import { couponNameAPI } from "@/api/coupon-name/get";

const CouponName = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = couponNameAPI();

  return (
    <Card>
      <Space>
        <Breadcrumb />
        <CreateBtn />
      </Space>
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default CouponName;
