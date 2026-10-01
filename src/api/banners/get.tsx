import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import {  SWRType } from "../types";

export interface BannerData {
  id        : number
  start_date: string;
  end_date  : string;
  url       : string;
  in_use    : boolean;
  imageOrigin: string;
  thumbnail : string;
  x         : number;
  y         : number;
  order     : number;
}

export const getBannerAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "columnby"      : "id",
      "orderby"       : "asc",
      "url"           : "",
      "in_use"        : null
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<BannerData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/bannerlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
