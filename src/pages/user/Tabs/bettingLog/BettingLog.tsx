import { Divider } from "antd";
import Filter from "./Filter";
import { userBetLogsAPI } from "@/api/betting-logs/get";
import { ResUser } from "@/api/types";
import List from "@/pages/betting/record/List";
import { parse } from "qs";
import SportsBettingRecord from "@/pages/betting/record/SportsBettingRecord";
import SportsMarketRecord from "@/pages/sports-market/SportsMarket";
// import Total from "@/pages/betting/record/component/Total";

interface Props {
  user: ResUser['data'] | undefined;
}

const BettingLog = ({ user }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters, query } = userBetLogsAPI(user?.username);

  const parsedQuery = parse(query)

  return (
    <>
      <Filter setFilter={setFilters} user={user} />
      <Divider />
      {/* <Total data={swr.data?.total} /> */}
      {parsedQuery.game_id === "custom_sportshistory" ? (
        <SportsBettingRecord user={user} />
      ) : parsedQuery.game_id === "custom_sportsmarket" ? (
        <SportsMarketRecord user={user} />
      ) : (
        <List
          data={swr.data?.data ?? []}
          totals={swr.data?.total}
          loading={swr.isLoading}
          onHeaderCell={onHeaderCell}
          pagination={paginationProps(swr.data?.totalitems)}
          mutate={swr.mutate}
        />
      )}
    </>
  );
};

export default BettingLog;
