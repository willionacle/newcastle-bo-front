import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { User } from "../users/get";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { ResPostList, SWRType } from "../types";
import { GF } from "@/utils/GlobalFunctions";

export interface DepositLogs {
  birthday: string;
  agent_tree_depth: number;
  tree_depth: number;
  id: string | string[];
  payment_method: string;
  user_id: any;
  username: any;
  admin_id: string;
  amount: number;
  status: "Waiting" | "Cancelled" | "Completed" | "Applied";
  system_note: string;
  user: User;
  bonus_percentage: number;
  bonus_amount: number;
  bonus_name: string | null;
  last_deposit: string | null;
  created_at: string;
  updated_at: string;
  user_real_name: string;
  oncash_pin: string | null;
  list_type?: string;
  auto_process_status: number;
  is_green?: boolean;
}

export const depositLogsAPI = () => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid: userid,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "id",
      agent: null,
      name: null,
      username: null,
      start_date: `${GF.formatDate(new Date(), false)} 00:00:00`,
      end_date: `${GF.formatDate(new Date(), false)} 23:59:59`,
      level: null,
      status: null,
      amount: null,
      approver: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    console.log(query);
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<ResPostList[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/depositlist`, query], fetcher,  {
    refreshInterval: 60000,
  });
  return { swr, onHeaderCell, setFilters, paginationProps, query };
};

export const depositUserLogsAPI = (username: string | undefined) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid: userid,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "created_at",
      username: username,
      start_date: null,
      end_date: null,
      status: null,
      list_type: null,
      transaction_type: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    console.log(query);
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<DepositLogs[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/depositwithdrawlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
