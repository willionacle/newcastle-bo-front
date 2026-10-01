import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { couponAPI } from "@/api/coupon/get";
import CreateBtn from "@/components/CreateBtn";
import Filter from "./Filter";
import { useTranslation } from "react-i18next";
import Total from "./component/Total";

const Coupon = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = couponAPI();
  const { t } = useTranslation();

  return (
    <Card>
      <Space>
        <Breadcrumb />
        <CreateBtn buttonLabel={t('coupon.cp013')} />
      </Space>
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <Total data={swr?.data?.total} />
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

export default Coupon;
