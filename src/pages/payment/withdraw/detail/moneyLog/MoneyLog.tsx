import Filter from "./Filter";
import { findBalanceLogStateQuery } from "@/api/balance-logs/get";
import { Divider } from "antd";
import List from "./List";
import { ResUser } from "@/api/types";

interface Props {
  user?: ResUser['data'] | undefined;
  onDateSelect?: (date: string) => void;
  lastDepositDate?: string;
  lastWithdrawRequestDate?: string;
}

const MoneyLog = ({ user, onDateSelect, lastDepositDate, lastWithdrawRequestDate }: Props) => {
  // 출금 페이지면 새 API, 아니면 기존 API 사용
  const { swr, onHeaderCell, paginationProps, setFilters } = findBalanceLogStateQuery(user?.username);

  return (
    <>
      <Filter 
        user={user} 
        setFilter={setFilters}
        lastDepositDate={lastDepositDate}
        lastWithdrawRequestDate={lastWithdrawRequestDate}
      />
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        onDateSelect={onDateSelect}
      />
    </>
  );
};

export default MoneyLog;
