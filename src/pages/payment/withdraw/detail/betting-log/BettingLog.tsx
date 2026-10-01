import { Divider, Flex } from "antd";
import i18next from "@/i18n/i18n";
import Filter from "./Filter";
import { userBetLogsAPIStateQuery } from "@/api/betting-logs/get";
import { ResUser } from "@/api/types";
import List from "@/pages/betting/record/List";
import { parse } from "qs";
import SportsBettingRecord from "./SportsBettingRecord";
import SportsMarketRecord from "@/pages/sports-market/SportsMarket";
import SummaryInAlert from "@/components/SummaryInAlert";
import commaNumber from "comma-number";

interface Props {
  user: ResUser["data"] | undefined;
  defaultDateRange: any;
}

const BettingLog = ({ user, defaultDateRange }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters, query } =
    userBetLogsAPIStateQuery(user?.username);

  const parsedQuery = parse(query);

  const summaryConfigs = [
    {
      title: i18next.t("memberDetail.mis131"),
      items: [
        { label: i18next.t("payment.maxWinAmount"), value: swr.data?.total?.live_maximum_result },
        { label: i18next.t("payment.maxBetAmount"), value: swr.data?.total?.live_maximum_bet,keepDecimal: true },
      ],
    },
    {
      title: i18next.t("memberDetail.mis132"),
      items: [
        { label: i18next.t("payment.maxWinAmount"), value: swr.data?.total?.slot_maximum_result },
        { label: i18next.t("payment.maxBetAmount"), value: swr.data?.total?.slot_maximum_bet,keepDecimal: true },
      ],
    },
    {
      title: i18next.t("memberDetail.mis133"),
      items: [
        {
          label: i18next.t("payment.maxWinAmount"),
          value: swr.data?.total?.sports_maximum_result,
        },
        { label: i18next.t("payment.maxBetAmount"), value: swr.data?.total?.sports_maximum_bet,keepDecimal: true, },
        { label: i18next.t("payment.maxWinOdds"), value: swr.data?.total?.sports_maximum_odds,keepDecimal: true, },
        {
          label: i18next.t("payment.footballBetFlag"),
          value: swr.data?.total?.single_bet_ox,
          isRaw: true,
        },
        {
          label: i18next.t("payment.singleFolderRatio"),
          value: swr.data?.total?.single_folder_ratio_pct,
          keepDecimal: true,
          extra: "%",
        },
      ],
    },
    {
      title: i18next.t("memberDetail.mis134"),
      items: [
        {
          label: i18next.t("payment.maxWinAmount2"),
          value: swr.data?.total?.minigame_maximum_result,
        },
        {
          label: i18next.t("payment.maxBetAmount2"),
          value: swr.data?.total?.minigame_maximum_bet,
          keepDecimal: true,
        },
      ],
    },
  ];


  return (
    <>
      <Filter
        setFilter={setFilters}
        defaultDateRange={defaultDateRange}
        user={user}
        gameCat={parsedQuery.game_category}
      />
      <Flex
        style={{ margin: "10px 0" }}
        align="flex-start"
        gap={5}
        wrap="wrap"
      >
        {summaryConfigs.map((group) => (
          <div key={group.title} style={{ margin: "10px 0" }}>
            <span style={{ fontWeight: "bold" }}>{group.title}</span>
            <SummaryInAlert
              data={group.items.map((item) => ({
                label: item.label,
                value: item.isRaw
                  ? item.value
                  : item.keepDecimal
                    ? commaNumber(Number(item.value ?? 0))
                    : commaNumber(Math.trunc(Number(item.value ?? 0))),
                extra: item.extra,
              }))}
              style={{
                textAlign: "left",
                marginTop: "5px",
                width: "fit-content",
              }}
              itemStyle={{ marginRight: "6px" }}
            />
          </div>
        ))}
      </Flex>
      <Divider />
      {parsedQuery.game_id === "custom_sportshistory" ? (
        <SportsBettingRecord user={user} defaultDateRange={defaultDateRange} />
      ) : parsedQuery.game_id === "custom_sportsmarket" ? (
        <SportsMarketRecord user={user} />
      ) : (
        <List
          data={swr.data?.data ?? []}
          totals={swr.data?.total}
          loading={swr.isLoading}
          onHeaderCell={onHeaderCell}
          pagination={paginationProps(swr.data?.totalitems)}
          category={parsedQuery.game_category as string}
          mutate={swr.mutate}
        />
      )}
    </>
  );
};

export default BettingLog;
