import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { Strapi, StrapiRes } from "../types/strapi";
import { User } from "../users/get";
import { DepositLogs } from "../deposit-logs/get";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { ResPostList, SWRType } from "../types";
import { GF } from "@/utils/GlobalFunctions";

export interface WithdrawalLogData  {
  agent_tree_depth: number;
  tree_depth: number;
  id: string
  "user_id": number,
  "agent_username": string,
  "referral_username": string
  username: User["username"];
  "user_real_name": string,
  "user_level": number,
  amount: number;
  "bank_name": string,
  "account_number": string,
  "account_name": string,
  status: DepositLogs["status"];
  "created_at": string,
  "updated_at": string,
  "admin_id": string,
  "system_note": string;
  transaction_type: string;
  user_regdate?: string;
  user_status?: string;
  withdraw_type?: string;
  oncash_pin?: string;
  last_deposit_type?: string;
}

export const withdrawalLogs = () => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'id',
        agent       : null,
        name        : null,
        username    : null,
        start_date  : `${GF.formatDate(new Date(), false)} 00:00:00`,
        end_date    : `${GF.formatDate(new Date(), false)} 23:59:59`,
        level       : null,
        status      : null,
        amount      : null,
        approver    : null,
        withdrawal_method    : null,
        verification_code    : null,
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    console.log(query)
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

  const swr = useSWR([`/withdrawlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps, query };
};

export const findOneWithdrawalLogs = (id: Strapi["id"] | undefined) => {
  const token = useUserStore.getState().token;
  useQuery();

  const fetcher = async ([url, query]: [string, Strapi["id"] | undefined]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<WithdrawalLogData>>
    >(`${url}/${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR(["/custom/withdrawals", id], id ? fetcher : null);
};

export const findWithdrawalLogs = (username: User["username"] | undefined) => {
  const token = useUserStore.getState().token;
  console.log(username)
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<WithdrawalLogData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/custom/withdrawals", query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};

export const withdrawalAgentAPI = () => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid      : userid,
      page				: 1,
      limit				: 100,
      orderby     : 'desc',
      columnby    : 'created_at',
      username    : null,
      user_real_name    : null,
      start_date  : GF.firstDayOfMonth(),
      end_date		: GF.lastDayOfMonth(),
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    console.log(query);
    const res = await instance.get(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  const swr = useSWR([`/agentwithdrawbalancelogs`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps, query };
};

export const withdrawalRollingAPI = (username?: string) => {
  const {token, userid} = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "id",
      username,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(
    ["/rollingpointlogs", query],
    username ? fetcher : null
  );
  return { swr, onHeaderCell, setFilters, paginationProps, query };
};

export const withdrawalLossingAPI = (username?: string) => {
  const {token, userid} = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "id",
      username,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(
    ["/lossingpointlogs", query],
    username ? fetcher : null
  );
  return { swr, onHeaderCell, setFilters, paginationProps, query };
};

export const withdrawalBalanceAPI = (username?: string) => {
  const {token, userid} = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "id",
      username,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(
    ["/agentbalancelogs", query],
    username ? fetcher : null
  );
  return { swr, onHeaderCell, setFilters, paginationProps, query };
};
