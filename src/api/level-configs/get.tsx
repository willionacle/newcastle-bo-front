import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery, { Option } from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface LevelConfigData {
  id: number;
  deposit_required?: string;
  level: number;
  level_up_mileage?: string;
  maximum_lossing_amount?: string;
  mileage_percentage?: number;
  rolling_casino_percentage?: number | null;
  rolling_mini_game_percentage?: number;
  rolling_required?: string;
  rolling_slot_percentage?: number;
  rolling_sports_percentage?: number;
  sports_single_rolling_percentage?: number;
  sports_multi_rolling_percentage?: number;
  weekly_lossing_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export const levelConfingAPI = (params?: Option["filter"]) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    params
      ? { filter: { ...params, userid: userid } }
      : {
          filter: {
            userid: userid,
            page: 1,
            limit: 100,
            orderby: "asc",
            columnby: "id",
          },
        }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<LevelConfigData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/levelconfiglist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
