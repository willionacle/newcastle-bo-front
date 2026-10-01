import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { Strapi, StrapiRes } from "../types/strapi";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { ResPostList, SWRType } from "../types";

export interface DepositBonusesData extends Strapi {
  bonusName: string;
  bonusPercentage: number;
  minDeposit: number;
  maxAmount: number;
  withdrawalRolling: number;
  allowGames: string; // json
  availableLevel: number;
  inUse: boolean;
  tempOrder: number;
  dailyLimit: null | number;
  systemNote: null | string;
}

export interface DepositBonusListType extends SWRType<ResPostList[]> {
  total: {
    total_amount: number, 
    total_bonus_amount: number
  }
}

export const depositBonusesAPI = (params?: any) => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'temp_order',
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
  
  const swr = useSWR([`/depositbonuslist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const depositBonusLogsAPI = (params?: any) => {
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
        bonus_name  : null,
        bonus_group : null,
        ...params
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<DepositBonusListType>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/depositbonuslogs`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const findDepositBonusesAPI = (id: string | undefined) => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<DepositBonusesData>>
    >(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  return useSWR(`/deposit-bonuses/${id}`, id ? fetcher : null);
};
