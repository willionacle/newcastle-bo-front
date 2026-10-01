
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import Filter from "./Filter";
import { userLevelUpLog } from "@/api/user-levelup-log/level-up";

const LevelUpLog = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = userLevelUpLog();

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
        mutate={swr.mutate}
       />
    </Card>
  );
};

export default LevelUpLog;
