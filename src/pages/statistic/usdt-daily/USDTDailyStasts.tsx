import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import Filter from "./Filter";
import List from "./List";
import { usdtStatsAPI } from "@/api/cs-statics/usdt-stats";

const USDTDailyStasts
 = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = usdtStatsAPI();

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List 
        data={swr.data?.data ?? []} 
        loading={swr. isLoading} 
        onHeaderCell={onHeaderCell} 
        pagination={paginationProps(swr.data?.totalitems)} 
        totals={swr.data?.totals}
      />
    </Card>
  );
};

export default USDTDailyStasts
;
