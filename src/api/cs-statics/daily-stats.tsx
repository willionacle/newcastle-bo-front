import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface DailyStatsData {
  date: string;
  depositSum: number;
  depositCount: number;
  withdrawalSum: number;
  withdrawalCount: number;
  netDeposit: number;
  betSum: number;
  winSum: number;
  netBet: number;
  totalBonusSum: number;
  /**
   * 출석보너스 지급액. 이미 totalBonusSum 에 포함되어 있으므로 더하면 이중 계산이다.
   * 마이그레이션(2026-09) 이전 데이터는 0 으로 내려온다.
   */
  attendanceBonusSum?: number;
  rollingPointSum: number;
  newUserCount: number;
  referredUser: number;
  depositUserCount: number;
  bettingUserCount: number;
  returneeUser: number;
  isAvg?: boolean;
}

export interface DailyStatsTotals {
  betSum: number;
  winSum: number;
  rollingPointSum: number;
  newUserCount: number;
  referredUser: number;
  returneeUser: number;
  depositSum: number;
  depositCount: number;
  withdrawalSum: number;
  withdrawalCount: number;
  totalBonusSum: number;
  /** totalBonusSum 에 이미 포함된 출석보너스 합계 */
  attendanceBonusSum?: number;
  netDeposit: number;
  netBet: number;
  depositUserCount: number;
  bettingUserCount: number;
}

export const dailyStatsAPI = () => {
  const { token } = useUserStore.getState()

  const { onHeaderCell, query, filters, setFilters, paginationProps } = useQuery(
    { filter: {
      page: 1,
      limit: 100
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<DailyStatsData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const totalsFetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<{ code: number; data: DailyStatsTotals; message: string }>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  // startDate와 endDate가 있을 때만 API 호출
  const hasDateFilter = filters?.startDate && filters?.endDate;
  const swr = useSWR(hasDateFilter ? [`/api/compressed-daily-stats`, query] : null, fetcher);
  const totalsSwr = useSWR(hasDateFilter ? [`/api/compressed-daily-stats/totals`, query] : null, totalsFetcher);

  return { swr, totalsSwr, onHeaderCell, setFilters, paginationProps };
};

export const dailyStatsTabAPI = () => {
  const { token } = useUserStore.getState()

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
      page: 1,
      limit: 100
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<DailyStatsData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  const swr = useSWR([`/api/compressed-daily-stats`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};
