import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
// import { User } from "../users/get";
import { NXAPI, SWRType } from "../types";

export interface CouponNameData extends NXAPI  {
  [x: string]: any;
  name: string;
  coupon_content: string;
  is_active: boolean;
}

export const couponNameAPI = (params?: any) => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'id',
        name        : null,
        coupon_content: null,
        is_active   : null,
        ...params
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<CouponNameData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/couponnamelist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const findCouponNameAPI = (id: string | undefined) => {
  const { token, userid } = useUserStore.getState();
  const { query } = useQuery({
    filter: { 
      userid  : userid,
      id      : id,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<CouponNameData>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR(["/getcouponname", query], fetcher);
};
