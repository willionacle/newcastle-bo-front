import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Button, Card, Divider, Flex, Space } from "antd";
import Filter from "./Filter";
import List from "./List";
import { userDailyStatsAPI, UserDailyStatsData } from "@/api/cs-statics/user-daily-stats";
import DownloadXlsx from "@/components/DownloadXlsx";
import Total from "./Total";
import { GF } from "@/utils/GlobalFunctions";
import GameCategoryButtonFilter from "./component/GameCategoryBtn";
import Top10Modal from "./Top10Modal";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { parse } from "qs";

interface ExcelReportType {
  "ID": string;
  "이름": string;
  "등급": string;
  "총판": string;
  "보유금": string;
  "상태": string;
  "추천인": string | null;
  "레벨": string;
  "최근접속": string;
  "마지막입금날짜": string;
  "입금액": number;
  "입금건수": number;
  "출금액": number;
  "베팅금액": number;
  "당첨금액": number;
  "취소금액": number;
  "롤링포인트": number;
  "입출차액": number;
  "베팅차액": number;
  "보너스총액": number;
  "기존입금": number;
  "기존출금": number;
}

const DailyUser = () => {
  const { swr, onHeaderCell, setFilters, paginationProps } = userDailyStatsAPI();
  const { search } = useLocation();
  const [isTop10Open, setIsTop10Open] = useState(false);

  // Derive the selected period the same way Filter does, so TOP10 reflects it.
  const period = parse(search.replace("?", "")) as { dateRange?: string[] };
  const top10StartDate = period.dateRange ? GF.formatDate(period.dateRange[0], false) : null;
  const top10EndDate = period.dateRange ? GF.formatDate(period.dateRange[1], false) : null;

  const sortResData = (data: UserDailyStatsData[] | undefined) => {
    const arr = [] as ExcelReportType[]
    if (data !== undefined && data !== null && data.length > 0) {
      data.map((item: UserDailyStatsData) => {
        arr.push({
          "ID": item.username,
          "이름": item.user_real_name,
          "등급": GF.handleGradeStrVal(item.user_grade),
          "레벨": item.user_level,
          "상태": item.user_status,
          "총판": item.agent_id ?? '',
          "추천인": item.referral ?? '',
          "보유금": item.balance,
          "최근접속": GF.cleanDateString(item.last_active_at, true),
          "마지막입금날짜": GF.cleanDateString(item.last_deposit_date, true),
          "입금액": item.deposit_sum + item.u_deposit_sum,
          "입금건수": item.deposit_count + item.u_deposit_count,
          "출금액": item.withdrawal_sum + item.u_withdrawal_sum,
          "베팅금액": item.bet_sum,
          "당첨금액": item.win_sum,
          "취소금액": item.cancel_sum,
          "롤링포인트": item.rolling_point_sum,
          "입출차액": item.dw_sum,
          "베팅차액": item.bw_sum,
          "보너스총액": item.bonus_total,
          "기존입금": item.initial_deposit,
          "기존출금": item.initial_withdrawal
        })
      })
    }
    return arr
  }

  return (
    <Card>
      <Flex justify="space-between">
        <Breadcrumb />
        <Space>
          <Button onClick={() => setIsTop10Open(true)} disabled={swr.isLoading}>
            {i18next.t("userStats.top10Data", "TOP10 데이터")}
          </Button>
          <DownloadXlsx data={swr.data && swr.data.data ? sortResData(swr.data?.data) : []} fileName={i18next.t("sidemenu.sm004")} />
        </Space>
      </Flex>
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <GameCategoryButtonFilter setFilters={setFilters} loading={swr.isLoading} />
      <Total total={swr.data?.totals} loading={swr.isLoading} />
      <Divider />
      <List 
        data={swr.data?.data ?? []} 
        loading={swr.isLoading} 
        totalItems={swr.data?.totalitems || 0} 
        onHeaderCell={onHeaderCell} 
        pagination={paginationProps(swr.data?.totalitems)} 
      />
      <Top10Modal
        open={isTop10Open}
        onClose={() => setIsTop10Open(false)}
        startDate={top10StartDate}
        endDate={top10EndDate}
      />
    </Card>
  );
};

export default DailyUser;
