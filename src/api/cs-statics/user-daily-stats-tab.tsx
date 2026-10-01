import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface DailyStatsTabData {
  date: string;
  username: string;
  userGrade: number;
  depositSum: number;
  depositCount: number;
  withdrawalSum: number;
  withdrawalCount: number;
  netDeposit: number;
  betSum: number;
  winSum: number;
  netBet: number;
  totalBonusSum: number;
  rollingPointSum: number;
  newUserCount: number;
  roll1: number;
  roll90: number;
  return1: number;
  return90: number;
  depositSum90: number;
  betSum90: number;
}

export const dailyStatsTabAPI = (username?: string) => {
  const { token } = useUserStore.getState()

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
      page: 1,
      limit: 100,
      username: username ?? null
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<DailyStatsTabData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  const swr = useSWR([`/api/compressed-user-stats`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};

