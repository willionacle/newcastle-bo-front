import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Flex } from "antd";
import List from "./List";
import { useTranslation } from "react-i18next";
import { withdrawalAgentAPI } from "@/api/withdrawal-logs/get";
import Filter from "./agentFilter/Filter";

const WithdrawAgent = () => {
  const { swr, setFilters, paginationProps } = withdrawalAgentAPI();

  const { t } = useTranslation();
  return (
    <>
      <Card>
        <Flex align="center" justify="space-between">
          <Breadcrumb replace={t("col.commissionManagement")} />
        </Flex>
        <Divider />
        <Filter setFilter={setFilters} />
        <List
          data={swr.data ? swr.data : []}
          loading={swr.isLoading}
          mutate={swr.mutate}
          pagination={paginationProps(swr.data?.total)}
        />
      </Card>
    </>
  );
};

export default WithdrawAgent;
