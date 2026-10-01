import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import Filter from "./Filter";
import { useTranslation } from "react-i18next";
import { couponApplicationAPI } from "@/api/coupon-application/get";

const CouponApplication = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = couponApplicationAPI();
  const { t } = useTranslation();

  return (
    <Card>
      <Space>
        <Breadcrumb replace={t('sidemenu.sm060')} />
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

export default CouponApplication;
