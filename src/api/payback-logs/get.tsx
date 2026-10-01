import useQuery from "@/hooks/useQuery";
import { User } from "../users/get";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import { NXAPI, SWRType } from "../types";
import { LossingData } from "../lossing-config/get";

export interface PaybackLogData extends NXAPI {
  username: User["username"];
  type: string;
  amount: number;
  system_ote: string;
  admin_id: string;
  type2: null | string;
  deposit_sum: null | number;
  withdrawal_sum: null | number;
  lossing_percentage: null | number;
  max_amount: null | number;
  prevlossing_point: null | number;
  sunday_balance: null | number;
}

export const findPaybackLogAPI = (username: User["username"] | undefined) => {
  const {token, userid} = useUserStore.getState();
  const { query, onHeaderCell, paginationProps, setFilters } = useQuery({
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
      AxiosResponse<SWRType<PaybackLogData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/lossingpointlog", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};

export interface PaybackListData extends NXAPI, Partial<Omit<LossingData, "id">> {
  "username": string;
  "amount": number;
  "system_note": string;
  "admin_id": string;
  "type": string;
  "deposit_sum": number;
  "withdrawal_sum": number;
  "lossing_percentage": number;
  "max_amount": number;
  "prevlossing_point": number;
  "sunday_balance": number;
  "status": number;
  "payment_method": string;
  "updated_amount": number;
  "adjustment_amount": number;
  "name": string;
  "start_date": string;
  "end_date": string;
  "user_id": number;
  "dw_sum": number;
  "deduction_amount": number;
  "payment_sum": number;
  "actual_amount": number;
}

export const getPaybackLogAPI = () => {
  const {token, userid} = useUserStore.getState();
  const { query, onHeaderCell, paginationProps, setFilters } = useQuery({
    filter: {
      userid      : userid,
      page				: 1,
      limit				: 100,
      orderby     : 'desc',
      columnby    : 'amount',
      username    : null,
      name        : null,
      status      : null,
      start_date  : null,
      end_date    : null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<PaybackListData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/paybacklist", query], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });

  return { swr, onHeaderCell, paginationProps, setFilters };
};
