import { Divider } from "antd";
import Filter from "./Filter";
import List from "./List";
import { SportsMarketData, sportsMarketEventAPI } from "@/api/sport-market/get";
import dayjs from "dayjs";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

interface Props {
  parentRecord: SportsMarketData;
}

const SportsMarketEvent = ({ parentRecord }: Props) => {
  const [searchParam, _] = useSearchParams();
  const { id } = useParams()
  const [filter, setFilter] = useState<Record<string, any>>({
    filter_username: id ? parentRecord.userName : searchParam.get("filter_username") || undefined, 
    filter_game_id: "bti",
    filter_startdate: dayjs.tz().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    filter_enddate: dayjs.tz().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    filter_sports: parentRecord.sportsName,
    filter_league: parentRecord.leagueName,
    filter_matchname: parentRecord.matchName,
    filter_matchdatetime: dayjs.tz(parentRecord.matchDateTime).format("YYYY-MM-DD HH:mm:ss"),
    orderby: "desc",
    columnby: "betSum",
    page: 1,
    limit: 20,
  });  
  const { swr } = sportsMarketEventAPI(filter);

  return (
    <>
      <Filter setFilter={setFilter} userId={id} />
      <Divider />
      <List 
        setFilter={setFilter}
        filter={filter}
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        totalitems={swr.data?.totalitems}
        mutate={swr.mutate}
      />
    </>
  );
};

export default SportsMarketEvent;
