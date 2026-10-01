import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { User } from "../users/get";
import { SWRType } from "../types";

export interface CouponData  {
  [x: string]: any;
  id : number;
  name: string;
  system_note: string;
  amount: number;
  is_used: boolean;
  allow_games: string;
  coupon_name: string;
  created_at: string;
  updated_at: string;
  expired_date: string;
}

export interface CouponListType extends SWRType<CouponData[]> {
  total: {
    total_amount: number, 
    total_bonus_amount: number
  }
}

export const couponAPI = (params?: any) => {
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
        amount      : null,
        coupon_name : null,
        start_date  : null,
        end_date		: null,
        ...params
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<CouponListType>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/couponlist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const findCouponAPI = (username: User["username"] | undefined) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, paginationProps, setFilters, query } = useQuery({
    filter: { 
      userid      : userid,
      page				: 1,
      limit				: 100,
      orderby     : 'desc',
      columnby    : 'id',
      username    : username,
      start_date  : null,
      end_date    : null,
      type        : null,
      system_note : null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<CouponListType>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/couponlog", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};
