import Filter from "./Filter";
import { findBalanceLog, findWithdrawalBalanceLog } from "@/api/balance-logs/get";
import { Divider } from "antd";
import List from "./List";
import { ResUser } from "@/api/types";
import { useLocation } from "react-router-dom";

interface Props {
  user?: ResUser['data'] | undefined;
  onDateSelect?: (date: string) => void;
  lastDepositDate?: string;
  lastWithdrawRequestDate?: string;
}

const MoneyLog = ({ user, onDateSelect, lastDepositDate, lastWithdrawRequestDate }: Props) => {
  const { pathname } = useLocation();
  const isWithdrawPage = pathname.includes('withdraw');
  
  // 출금 페이지면 새 API, 아니면 기존 API 사용
  const { swr, onHeaderCell, paginationProps, setFilters } = isWithdrawPage 
    ? findWithdrawalBalanceLog(user?.username)
    : findBalanceLog();

  return (
    <>
      <Filter 
        user={user} 
        setFilter={setFilters}
        lastDepositDate={lastDepositDate}
        lastWithdrawRequestDate={lastWithdrawRequestDate}
        isWithdrawPage={isWithdrawPage}
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
