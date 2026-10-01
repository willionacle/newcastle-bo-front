import useUserStore from "@/store/user.store";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import instance from "../axios";
import { AgentType, DefaultResponseInterface, ListCommon, SWRType } from "../types";
import { GF } from "@/utils/GlobalFunctions";

export interface AgentBalanceLog extends ListCommon {
  username: string;
  record_type: string;
  amount: number;
  system_note: string;
  admin_id: string;
  prev_balance: number;
  post_balance: number;
  userId: number | null;
  admin_username: string;
  user_real_name: string;
}

export const agentAPI = (filter?: object | undefined) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid: userid,
      page: 1,
      limit: 9999,
      columnby: "id",
      orderby: "desc",
      user_status: "",
      username: "",
      user_real_name: "",
      user_level: "",
      start_date: null,
      end_date: null,
      ...filter,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<AgentType[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/agentdropdownlist`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const agentBalanceLog = () => {

  const {token, userid} = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery({
    filter: {
      userid      : userid,
      page				: 1,
      limit				: 100,
      orderby     : 'desc',
      columnby    : 'created_at',
      username    : null,
      type        : JSON.stringify(['']),
      system_note : null,
      start_date  : GF.firstDayOfMonth(),
      end_date		: GF.lastDayOfMonth(),
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<AgentBalanceLog[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res);

    return res.data;
  };

  const swr = useSWR([`/commissionlogs`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};

export const agentListAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"                : userid,
      "page"                  : 1,
      "limit"                 : 100,
      "orderby"               : "desc",
      "user_status"           : "",
      "username"              : "",
      "user_real_name"        : "",
      "user_level"            : "",
      "start_date"            : "",
      "end_date"              : "",
      "tree_depth"            : "",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<AgentType[]>>>(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/agentlist`, query], fetcher);

  return { swr, onHeaderCell, query, setFilters, paginationProps };
};

interface AgentBalance {
  balance: number;
}

export const agentBalanceAPI = () => {
  const {token} = useUserStore.getState()

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<DefaultResponseInterface<AgentBalance>>>(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(`/agentbalance`, fetcher);

  return { swr };
};