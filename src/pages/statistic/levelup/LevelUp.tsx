
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { levelUpStatsAPI } from "@/api/cs-statics/level-up";
import Filter from "./Filter";

const LevelUp = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = levelUpStatsAPI();

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List  
        data={swr.data?.data ?? []} 
        loading={swr.isLoading} 
        onHeaderCell={onHeaderCell} 
        pagination={paginationProps(swr.data?.totalitems)} 
       />
    </Card>
  );
};

export default LevelUp;
