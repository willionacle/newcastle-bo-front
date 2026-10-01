import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery, { Option } from "@/hooks/useQuery";
import { ResUser, SWRType } from "../types";
import useStateQuery from "@/hooks/useStateQuery";

// 정상유저: ACTIVE
// 장기미접: INACTIVE
// 탈퇴유저: DEACTIVATED
// 정지유저: SUSPENDED

export interface User {
  id: number
  accountName: string;
  accountNumber: string;
  adminLevel: number | null;
  balance: null | number;
  bankName: string;
  blocked: boolean;
  confirmed: boolean;
  email: string;
  lastBetDatetime: null | string;
  last_login: string;
  lossingPoint: number;
  mileage: null | number;
  provider: string;
  rollingCasinoPercentage: number;
  rollingMiniGamePercentage: number;
  rollingPoint: number;
  rollingSlotPercentage: number;
  rollingSportsPercentage: number;
  depositTotal: string;
  withdrawalTotal: string;
  tree_depth: number;
  user_level: number | null;
  username: string;
  status: "ACTIVE" | "INACTIVE" | "DEACTIVATED" | "SUSPENDED";
  referral: Referral | null;
  referralPoint: number;
  agent_id: Agent | null;
  isOnline: boolean;
  nickname: string;
  rollingPointType: "OFF" | "LEVEL" | "IDVIDUAL";
  lossingPointType: "OFF" | "LEVEL" | "IDVIDUAL";
  lossingPointPercentage: number;
  decodePassword: string;
  userRealName: string | null;
  systemNote: string | null;
  birthday: string;
  userMemo1: null | string;
  userMemo2: null | string;
  userMemo3: null | string;
  userMemo4: null | string;
  userMemo5: null | string;
  userMemo6: null | string;
  identification: null | boolean;
  identificationDate: null | string;
  subscriptionDate: null | string;
  settlementCycle: null | number;
  settlementCycleDay: null | number;
  agentLossingPointPercentage: null | number;
  betTotal: number;
  levelType: "AUTO" | "MANUAL";
  dwSum: number;
  bwSum: number;
  deposit_count_total: number;
}

interface Agent {
  id: User["id"];
  username: User["username"];
  nickname: User["nickname"];
  accountName: User["accountName"];
}

interface Referral {
  id: User["id"];
  username: User["username"];
  nickname: User["nickname"];
  accountName: User["accountName"];
}

export const userAPI = (params?: Option['filter']) => {
  const {token} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    params ?  {filter: {...params}} :
    { filter: {
        page				: 1,
        limit				: 100,
        orderby     : 'DESC',
        columnby    : 'createdAt',
        status      : null,
        username    : null,
        referralUsername	: null,
        agentUsername		: null,
        userRealName		: null,
        userLevel        : null,
        startDate        : null,
        endDate          : null,
      }
    }
  );

  const listFetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<any>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const summaryFetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<any>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const listSwr = useSWR([`/api/users/list`, query], listFetcher);
  const summarySwr = useSWR([`/api/users/list-summary`, query], summaryFetcher);

  return { listSwr, summarySwr, onHeaderCell, setFilters, paginationProps };
};

export const findUsersAPI = (id?: string) => {
  const {token, userid} = useUserStore.getState()

  const fetcher = async () => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<ResUser['data']>>>(
      `/getuser`, {userid, id},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data?.data;
  };

  return useSWR(`/getuser/${id}`, id ? fetcher : null, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: true
  });
};

// User list state only managed query (not persisted with URL search params)
export const userAPIStateQuery = (params?: Option['filter']) => {
  const {token} = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useStateQuery(
    params ?  {filter: {...params}} :
    { filter: {
        page				: 1,
        limit				: 100,
        orderby     : 'DESC',
        columnby    : 'createdAt',
        status      : null,
        username    : null,
        referralUsername	: null,
        agentUsername		: null,
        userRealName		: null,
        userLevel        : null,
        startDate        : null,
        endDate          : null,
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<any>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/api/users/list`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};
