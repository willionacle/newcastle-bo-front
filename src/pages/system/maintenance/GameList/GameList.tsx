import { Divider } from "antd";
import List from "./List";
import { GameListAPI } from "@/api/game-maintenances/get";
import Filter from "./Filter";

interface Props {
  vendor_id?: string;
  game_category?: string;
}

const GameList = (Props: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = GameListAPI(Props);

  return (
    <>
      <Filter setFilters={setFilters} />
      <Divider />
      <List
        data={swr.data && swr.data.data ? swr.data.data?.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)) : []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </>
  );
};

export default GameList;
