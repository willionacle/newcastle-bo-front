import Filter from "./Filter";
import { Divider } from "antd";
import List from "./List";
import { findBalanceLog } from "@/api/balance-logs/get";
import { User } from "@/api/users/get";

interface Props {
  username: User["username"] | undefined;
}

const BalanceLog = ({ username = "" }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } =
    findBalanceLog(username);

  return (
    <>
      <Filter setFilter={setFilters} username={username} />
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </>
  );
};

export default BalanceLog;
