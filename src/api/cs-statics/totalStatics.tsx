import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { GF } from "@/utils/GlobalFunctions";
import topbarStore from "@/store/topbar.store";
import { DepositLogs } from "../deposit-logs/get";
import { WithdrawalLogData } from "../withdrawal-logs/get";

export interface TotalStaticsData {
  totalAmount: number;
  totalRollingPoint: number;
  totalLossingPoint: number;
  totalUsers: number;
  onlineUsers: number;
  totalDailyDeposit: number;
  totalDailyWithdrawal: number;
  totalDailyDWSum: number;
  totalDailyCouponBonus: number;
  totalMonthlyDeposit: number;
  totalMonthlyWithdrawal: number;
  totalMonthlyDWSum: number;
  totalMonthlyCouponBonus: number;
  newUsersToday: number;
  totalDailyRollingPoint: number;
  totalMonthlyRollingPoint: number;
}

export interface DwStats {
  depositCounts: {
    Waiting: number;
    Cancelled: number;
    Completed: number;
    Applied: number;
  };
  withdrawalCounts: {
    Waiting: number;
    Cancelled: number;
    Completed: number;
    Applied: number;
  };
  userCounts: {
    Applied: number;
    Completed: number;
  };
}

interface GameStats {
  betSum: number;
  resultSum?: number;
  gainSum?: number;
  losingSum?: number;
  sumLosing?: number;
}

export interface GameStatsResponse {
  btiBetSum?: GameStats;
  btiFinalizedBetSum?: GameStats;
  live?: GameStats;
  slot?: GameStats;
  minigame?: GameStats;
}

export interface StatsDataType {
  [key: string]: number;
}

export interface TopUser {
  user_id?: number;
  username?: string;
  user_real_name: string;
  balance: number | string;
  is_total?: boolean;
  is_online?: 1 | 0 | undefined;
}

export interface RecentTrans {
  deposits: DepositLogs[];
  withdrawals: WithdrawalLogData[];
  tops: DepositLogs[];
  belows: WithdrawalLogData[];
  topusers: TopUser[];
  totalbalance: number;
}

export interface SWRRes {
  code: number;
  message: string;
  data: StatsDataType;
  data2: RecentTrans
}

const startDate = `${GF.formatDate(new Date, false)} 00:00:00`
const endDate = `${GF.formatDate(new Date, false)} 23:59:59`

const query = `?startdate=${startDate}&enddate=${endDate}`

export const totalStaticsAPI = () => {
  const token = useUserStore.getState().token;
  const setTopbarData = topbarStore((state) => state.setTopbarData);

  const fetcher = async () => {
    const res = await instance.get<undefined ,AxiosResponse<SWRRes>>('/topbarstatistics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    const statsRes = res.data.data ?? null;
    const recentTrans = res.data.data2 ?? null;
    // const {Complete, Pending} = res[1].data.data ?? null
    const data = {
      ...statsRes,
      // total_sport_bet_today: Complete.betAmount,
      // total_sport_bet_result_today: Complete.winningAmount,
      // total_sport_bet_winlose_today: Complete.winlose,
      // total_sport_ing_bet_today: Pending.betAmount,
      // total_sport_ing_gain_today: Pending.expectedAmount,
    } 
    console.log(data)
    setTopbarData(data);

    return {
      data: data as StatsDataType,
      recentTrans,
    }
  };

  return useSWR(["/topbarstatistics",  `/transfer/bti/bethistorysumdata${query}`], fetcher, {
    refreshInterval: 10000, // 10초마다 자동 갱신
  });
};
