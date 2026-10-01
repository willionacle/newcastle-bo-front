import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { StrapiRes } from "../types/strapi";
import { AxiosResponse } from "axios";
import { ResPostList, SWRType } from "../types";

export interface LevelAccountData  {
  id: number
  account_name: string;
  account_number: string;
  bank_name: string;
  level: number;
  created_at: string | null;
  updated_at: string | null;
}

export const levelAccountAPI = (params?: any) => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'id',
        ...params
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<ResPostList[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/levelaccountlist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const findLevelAccountAPI = (id: string | undefined) => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<LevelAccountData>>
    >(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  return useSWR("/level-accounts/" + id, id ? fetcher : null);
};
