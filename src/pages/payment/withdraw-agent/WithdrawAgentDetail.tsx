import i18next from "@/i18n/i18n";
import {
  withdrawalBalanceAPI,
  withdrawalLossingAPI,
  withdrawalRollingAPI,
} from "@/api/withdrawal-logs/get";
import Breadcrumb from "@/components/Breadcrumb";
import ListDetailBallance from "@/pages/payment/withdraw-agent/ListDetailBallance";
import ListDetailLossing from "@/pages/payment/withdraw-agent/ListDetailLossing";
import ListDetailRolling from "@/pages/payment/withdraw-agent/ListDetailRolling";
import { Card, Divider, Flex, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const WithdrawAgentDetail = () => {
  const { username } = useParams();
  const rolling = withdrawalRollingAPI(username);
  const lossing = withdrawalLossingAPI(username);
  const balance = withdrawalBalanceAPI(username);

  const { t } = useTranslation();

  console.log('ROLLING AGENT LOGS',rolling.swr.data)

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: i18next.t("payment.rollingHistory"),
      children: (
        <ListDetailRolling
          data={rolling.swr.data ? rolling.swr.data.data : []}
          loading={rolling.swr.isLoading}
          mutate={rolling.swr.mutate}
          pagination={rolling.paginationProps(rolling.swr.data?.total)}
        />
      ),
    },
    {
      key: "2",
      label: i18next.t("payment.losingHistory"),
      children: (
        <ListDetailLossing
          data={lossing.swr.data ? lossing.swr.data.data : []}
          loading={lossing.swr.isLoading}
          mutate={lossing.swr.mutate}
          pagination={lossing.paginationProps(lossing.swr.data?.total)}
        />
      ),
    },
    {
      key: "3",
      label: i18next.t("payment.balanceHistory"),
      children: (
        <ListDetailBallance
          data={balance.swr.data ? balance.swr.data.data : []}
          loading={balance.swr.isLoading}
          mutate={balance.swr.mutate}
          pagination={balance.paginationProps(balance.swr.data?.total)}
        />
      ),
    },
  ];

  return (
    <>
      <Card>
        <Flex align="center" justify="space-between">
          <Breadcrumb replace={t("col.commissionManagement")} />
        </Flex>
        <Divider />

        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </>
  );
};

export default WithdrawAgentDetail;
