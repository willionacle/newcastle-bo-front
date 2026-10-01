import i18next from "@/i18n/i18n";
import { agentListAPI } from "@/api/agent/get";
import Breadcrumb from "@/components/Breadcrumb";
import Filter from "@/pages/agent/agent/Filter";
import { Card, Divider } from "antd";
import List from "./List";

const AgentTable = () => {
  const { swr, onHeaderCell, setFilters, paginationProps } = agentListAPI();

  return (
    <Card>
      <Breadcrumb replace={i18next.t("sidemenu.agentList")} />
      <Divider />

      <Filter setFilter={setFilters} />

      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  );
};

export default AgentTable;
