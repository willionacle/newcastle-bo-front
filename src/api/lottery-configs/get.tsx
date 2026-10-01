import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { Strapi, StrapiRes } from "../types/strapi";

export interface LotteryConfigData extends Strapi {
  rank: number;
  cnt: number;
  amount: string;
  percentage: number;
  publishedAt: string;
}

export const lotteryConfigAPI = () => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get<
      any,
      AxiosResponse<StrapiRes<LotteryConfigData[]>>
    >(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR("/lottery-configs", fetcher);
};
