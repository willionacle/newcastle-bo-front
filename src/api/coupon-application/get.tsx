import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { NXAPI, SWRType } from "../types";

export interface CouponApplicationData extends NXAPI  {
  event_name: string;
  bet_id: string;
  user_id: number;
  status: number;
  is_used: boolean;
  username: string;
  user_real_name: string;
  bet_details: string;
  bet_top_details: string;
}

export const couponApplicationAPI = () => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'id',
        username    : null,
        bet_id      : null,
        event_name  : null,
        status      : null,
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<CouponApplicationData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/couponapplicationlist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};