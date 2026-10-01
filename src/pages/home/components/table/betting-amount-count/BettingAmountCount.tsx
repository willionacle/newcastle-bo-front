import { getLineChartBetingAmount } from "@/api/dashboard/get";
import List from "./List";

const BettingAmounTable = () => {
  const { data, isLoading } = getLineChartBetingAmount();

  return (
    <List
      data={data?.data || []}
      loading={isLoading}
    />
  )
}

export default BettingAmounTable;