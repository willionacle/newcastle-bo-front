import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { referralLogAPI } from "@/api/referral-logs/get";
import Filter from "./Filter";

const ReferralLog = () => {

  const { swr, setFilters, onHeaderCell, paginationProps } = referralLogAPI()

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Filter setFilters={setFilters} />
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

export default ReferralLog;
