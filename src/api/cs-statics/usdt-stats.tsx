import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface DailyUSDTStatsData {
  unique_user_count: number;
  date: string;
  deposit_sum: number;
  deposit_sum_usdt: number;
  deposit_count: number;
  withdrawal_sum: number;
  withdrawal_sum_usdt: number;
  withdrawal_count: number;
  winlose: number;
  winlose_usdt: number;
  exchange_rate: number;
  created_at: number;
  updated_at: number;
}

export const usdtStatsAPI = () => {
  const { userid, token } = useUserStore.getState()

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
      userid,
      page: 1,
      limit: 100,
      orderby: 'desc',
      columnby: 'date',
      start_date: null,
      end_date: null,
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<DailyUSDTStatsData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  const swr = useSWR([`/compressedusdtdailystats`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};
