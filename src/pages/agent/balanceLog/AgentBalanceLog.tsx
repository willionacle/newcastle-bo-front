import Filter from "./Filter";
import { Card, Divider } from "antd";
import List from "./List";
import { ResUser } from "@/api/types";
import { agentBalanceLog } from "@/api/agent/get";
import Breadcrumb from "@/components/Breadcrumb";
import { useTranslation } from "react-i18next";

interface Props {
  user?: ResUser['data'] | undefined;
}

const AgentBalanceLog = ({ user }: Props) => {
  const {t} = useTranslation();
  const { swr, onHeaderCell, paginationProps, setFilters } = agentBalanceLog();
  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm061")} />
      <Divider />
      <Filter user={user} setFilter={setFilters} />
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  );
};

export default AgentBalanceLog;
