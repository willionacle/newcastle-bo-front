import { getChartTable } from "@/api/dashboard/get";
import List from "./List";

const DashboardTable = () => {
  const { data, isLoading } = getChartTable();

  return (
    <List
      data={data?.data || []}
      loading={isLoading}
    />
  )
}

export default DashboardTable;