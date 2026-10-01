import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import Filter from "./Filter";
import List from "./List";
import { agentPeriodStatsAPI } from "@/api/cs-statics/agent-stats";

const AgentPeriod = () => {
  const { swr, setFilters, onHeaderCell } = agentPeriodStatsAPI();

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List data={swr.data?.data} loading={swr.isLoading} onHeaderCell={onHeaderCell} />
    </Card>
  );
};

export default AgentPeriod;
