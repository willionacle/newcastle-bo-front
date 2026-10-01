import { findWithdrawalLogs } from "@/api/withdrawal-logs/get";
import List from "./List";
import Filter from "./Filter";
import { User } from "@/api/users/get";

interface Props {
  user: User | undefined;
}

const WithdrawLog = ({ user }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = findWithdrawalLogs(
    user?.username
  );

  return (
    <>
      <Filter setFilters={setFilters} user={user} />
      <List
        data={swr.data ? swr.data.data : []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.meta.pagination.total)}
      />
    </>
  );
};

export default WithdrawLog;
