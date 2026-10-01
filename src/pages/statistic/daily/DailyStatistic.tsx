import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import Filter from "./Filter";
import List from "./List";
import { dailyStatsAPI } from "@/api/cs-statics/daily-stats";
import { User } from "@/api/types";

interface Props {
  data?: User;
  asUserTabContent?: boolean;
}

const DailyStatistic = ({data: _data, asUserTabContent}: Props) => {
  const { swr, totalsSwr, onHeaderCell, paginationProps, setFilters } = dailyStatsAPI();

  return !asUserTabContent ? (
    <Card>
      <Breadcrumb />
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        totals={totalsSwr.data?.data}
        loading={swr. isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  ) : (
    <>
      <Filter setFilter={setFilters} />
        <Divider />
        <List
          data={swr.data?.data ?? []}
          totals={totalsSwr.data?.data}
          loading={swr. isLoading}
          onHeaderCell={onHeaderCell}
          pagination={paginationProps(swr.data?.totalitems)}
        />
    </>
  );
};

export default DailyStatistic;
