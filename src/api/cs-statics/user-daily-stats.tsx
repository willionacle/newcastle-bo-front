import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface UserDailyStatsData {
  [x: string]: any;
  total_bet_sum: number;
  total_bonus: number;
  total_bw_sum: number;
  total_cancel_sum: number;
  total_coupon_sum: number;
  total_deposit_bonus_sum: number;
  total_deposit_count: number;
  total_deposit_sum: number;
  total_dw_sum: number;
  total_lossing_point_sum: number;
  total_referral_point_sum: number;
  total_rolling_point_sum: number;
  total_win_sum: number;
  total_withdrawal_count: number;
  total_withdrawal_sum: number;
  username: string;
  initial_deposit: number;
  initial_withdrawal: number;
}

export interface UserDailyStatsTotal {
  total_deposit_sum: number;
  total_deposit_count: number;
  total_withdrawal_sum: number;
  total_withdrawal_count: number;
  total_bet_sum: number;
  total_win_sum: number;
  total_cancel_sum: number;
  total_rolling_point_sum: number;
  total_lossing_point_sum: number;
  total_referral_point_sum: number;
  total_coupon_sum: number;
  total_deposit_bonus_sum: number;
  total_dw_sum: number;
  total_bw_sum: number;
  total_bonus: number;
  total_balance: number;
  total_u_deposit_sum: number;
  total_u_deposit_count: number;
  total_u_deposit_bonus_sum_usdt: number;
  total_u_withdrawal_count: number;
  total_u_withdrawal_sum: number;
  total_u_withdrawal_sum_usdt: number;
}

export const userDailyStatsAPI = () => {
  const { userid, token } = useUserStore.getState();

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid,
      page: 1,
      limit: 5000,
      orderby: "desc",
      columnby: "roll_90",
      username: null,
      start_date: null,
      end_date: null,
      game_category:""
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<UserDailyStatsData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };
  const swr = useSWR([`/compressedbyuser`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};
