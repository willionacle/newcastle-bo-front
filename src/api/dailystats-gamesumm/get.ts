import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";
import { GF } from "@/utils/GlobalFunctions";
import { RevenueData } from "../revenue/get";
import { DailyStatsTabData } from "../cs-statics/user-daily-stats-tab";
import { parse, stringify } from "qs";

export interface CompressedUserStatsTotalSummary {
  betSum: number;
  winSum: number;
  newUserCount: number;
  depositSum_90: number;
  betSum_90: number;
  rollingPointSum: number;
  depositSum: number;
  depositCount: number;
  withdrawalSum: number;
  withdrawalCount: number;
  totalBonusSum: number;
  netDeposit: number;
  netBet: number;
}

export const dailyStatsRevenueAPI = (
  username?: string
) => {
  const {token, userid} = useUserStore.getState();

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    {
      filter: {
        userid: userid,
        username: username ?? null,
        vendor_id: null,
        start_date: `${GF.formatDate(new Date(), false)} 00:00:00`,
        end_date: `${GF.formatDate(new Date(), false)} 23:59:59`,
        page: 1,
        limit: 100,
      },
    }
  );

  const fetcher = async (query: string) => {
    const dQuery = stringify({
      ...parse(query),
      userid: undefined,
      vendor_id: undefined,
    });
    const rQuery = stringify({
      ...parse(query),
      page: undefined,
      limit: undefined,
      orderby: undefined,
      columnby: undefined
    });
    const res01 = await instance.get<undefined, AxiosResponse<SWRType<RevenueData>>>(
      `/gameidsummary?${rQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const res02 = await instance.get<undefined, AxiosResponse<SWRType<DailyStatsTabData[]>>>(
      `/api/compressed-user-stats?${dQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      revenue: res01?.data?.data || [],
      dailyStats: res02?.data?.data || [],
      totalitems: res02.data.totalitems,
      totalSummary:res02.data.totalSummary
    };
  };

  const swr = useSWR(query, username ? fetcher : null);

  return { swr, onHeaderCell, setFilters, paginationProps };
};
