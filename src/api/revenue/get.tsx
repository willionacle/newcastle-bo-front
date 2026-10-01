import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";
import { GF } from "@/utils/GlobalFunctions";

export interface RevenueData {
  "vendor_id": string;
  "game_category": string;
  "total_bet_amount": number;
  "total_win_amount": number;
  "total_win_loss": number;
  "total_bet_count": number;
  "total_user_bet_count": number;
  "rate": number;
  "user_id": number;
}

export const revenueAPI = (
  username?: string
) => {
  const {token, userid} = useUserStore.getState();

  const { query, setFilters } = useQuery(
    {
      filter: {
        userid: userid,
        username: username ?? null,
        vendor_id: null,
        start_date: `${GF.formatDate(new Date(), false)} 00:00:00`,
        end_date: `${GF.formatDate(new Date(), false)} 23:59:59`,
        game_category: null,
      },
    }
  );

  const fetcher = async ([url, query]: [string, any]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<RevenueData>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR(["gameidsummary", query], fetcher);

  return {swr, setFilters};
};
