import useUserStore from "@/store/user.store";
import instance from "../axios";
import useQuery from "@/hooks/useQuery";
import useSWR from "swr";
import { Strapi, StrapiRes } from "../types/strapi";
import { AxiosResponse } from "axios";

export interface LotteryLogData extends Strapi {
  username: "test01";
  prizeAmount: null | string;
  dateOfUsed: string | null;
  isUsed: boolean;
  rank: null | number;
}

export const lotteryLogsAPI = () => {
  const token = useUserStore.getState().token;
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<LotteryLogData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/lottery-logs", query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};
