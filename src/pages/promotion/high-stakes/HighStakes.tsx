import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Statistic, Tabs } from "antd";
import ThresholdGrid from "./components/ThresholdGrid";
import HistoryFilter from "./components/HistoryFilter";
import HistoryList from "./components/HistoryList";
import { highStakesHistoryListAPI, HighStakesHistoryTotals } from "@/api/high-stakes/get-history";
import { useSearchParams } from "react-router-dom";

// 고액배팅 알림 (client requests 20 / 20-1) -- threshold grid + review history
// on one page, tabbed, same split the header alert links into.
// See HIGH_STAKES_ALERT_FRONTEND_INTEGRATION.md.
const HighStakes = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { swr, onHeaderCell, paginationProps, setFilters } = highStakesHistoryListAPI();
  const totals = swr.data?.totals as HighStakesHistoryTotals | undefined;
  const activeTab = searchParams.get("tab") === "history" ? "history" : "settings";

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          const next = new URLSearchParams(searchParams);
          next.set("tab", key);
          setSearchParams(next);
        }}
        items={[
          {
            key: "settings",
            label: t("highStakes.settingsTab"),
            children: <ThresholdGrid />,
          },
          {
            key: "history",
            label: t("highStakes.historyTab"),
            children: (
              <>
                <HistoryFilter setFilters={setFilters} />
                <Divider />
                <div style={{ display: "flex", gap: 48, marginBottom: 16 }}>
                  <Statistic title={t("highStakes.totalBets")} value={totals?.bets ?? 0} />
                  <Statistic title={t("highStakes.totalStaked")} value={totals?.staked ?? 0} suffix="원" />
                </div>
                <HistoryList
                  data={swr.data?.data ?? []}
                  loading={swr.isLoading}
                  pagination={paginationProps(swr.data?.totalitems)}
                  onHeaderCell={onHeaderCell}
                />
              </>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default HighStakes;
