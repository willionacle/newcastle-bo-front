import { Divider } from "antd";
import Filter from "./Filter";
import List from "@/pages/promotion/coupon/List";
import { findCouponAPI } from "@/api/coupon/get";
import { ResUser } from "@/api/types";

interface Props {
  user: ResUser['data'] | undefined;
}

const CouponTap = ({ user }: Props) => {
  const { onHeaderCell, paginationProps, swr, setFilters } = findCouponAPI(
    user?.username
  );

  return (
    <>
      <Filter setFilters={setFilters} user={user} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
        totals={swr.data?.totals}
      />
    </>
  );
};

export default CouponTap;
