import { revenueAPI } from "@/api/revenue/get";
import Filter from "./Filter";
import List from "./List";
import GameCategoryButtonFilter from "@/components/GameCategoryBtn";
import { Divider } from "antd";

interface Props {
  username?: string;
}

const TopInfo = ({ username }: Props) => {
  const {swr, setFilters} = revenueAPI(username);

  return (
    <>
      <Filter setFilters={setFilters} username={username} />
      <Divider />
      {username === undefined && (
        <GameCategoryButtonFilter setFilters={setFilters} loading={swr.isLoading} forBettingStats/>
      )}
      <List 
        data={swr.data?.data}
        userCount={swr.data?.userCount}
        loading={swr.isLoading}
      />
      
    </>
  );
};

export default TopInfo;
