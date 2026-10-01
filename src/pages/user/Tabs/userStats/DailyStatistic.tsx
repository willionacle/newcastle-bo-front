import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import Filter from "./Filter";
import List from "./List";
import { User } from "@/api/types";
import { dailyStatsTabAPI } from "@/api/cs-statics/user-daily-stats-tab";

interface Props {
  data?: User;
  asUserTabContent?: boolean;
}

const DailyStatistic = ({data, asUserTabContent}: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = dailyStatsTabAPI(data?.username);

  const tableData = Array.isArray(swr.data?.data) ? swr.data.data : [];

  return !asUserTabContent ? (
    <Card>
      <Breadcrumb />
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List
        data={tableData}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  ) : (
    <>
      <Filter setFilter={setFilters} />
        <Divider />
        <List
          data={tableData}
          loading={swr.isLoading}
          onHeaderCell={onHeaderCell}
          pagination={paginationProps(swr.data?.totalitems)}
        />
    </>
  );
};

export default DailyStatistic;
