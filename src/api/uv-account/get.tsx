import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { AxiosResponse } from "axios";
import { ResPostList, SWRType } from "../types";
import { UVBody } from "./post";

export interface UVAccountData extends UVBody {
  idx: number;
  regDate: string | null;
}

export const uvAccountAPI = (params?: any) => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'idx',
        type        : params.type ?? null,
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
  
  const swr = useSWR([`/virtualaccountlist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const findUVAccountAPI = (id?: string) => {
  const {token, userid} = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<UVAccountData>>
    >(`${url}?userid=${userid}&id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  return useSWR("/getvirtualaccount", id ? fetcher : null);
};
