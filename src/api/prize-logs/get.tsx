import useQuery from "@/hooks/useQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { Strapi, StrapiRes } from "../types/strapi";
import { User } from "../users/get";
import { AxiosResponse } from "axios";

export interface PrizeLogsData extends Strapi {
  adminId: null | User["username"];
  itemName: string;
  salesTime: string;
  status: "PENDING" | "COMPLETE";
  userLevel: User["user_level"];
  username: User["username"];
}

export const prizeLogsAPI = () => {
  const token = useUserStore.getState().token;
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<PrizeLogsData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.data;
  };

  const swr = useSWR(["/prize-logs", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};
