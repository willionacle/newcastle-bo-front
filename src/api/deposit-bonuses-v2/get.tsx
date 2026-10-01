import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";

export interface DepositBonusV2Data {
  exposurePeriods: string;
  id: number;
  bonusName: string;
  bonusPercentage: number;
  minDeposit: number;
  maxAmount: number;
  withdrawalRolling: number;
  availableLevels: number[];
  availableGrades: number[];
  bonusType: 0 | 1 | 2;
  inUse: 0 | 1;
  tempOrder: number;
  dailyLimit: number | null;
  systemNote: string | null;
  bonusGroup: string;
  // Once-ever "welcome" bonus (granted on the member's first deposit ever),
  // as opposed to 첫충 bonuses which reset daily. See
  // WELCOME_BONUS_AND_MAINTENANCE_FRONTEND_INTEGRATION.md §16. The backend
  // accepts true/false/1/0/null on write; normalize to boolean on read.
  isWelcome?: boolean | 0 | 1 | null;
  createdAt: string;
  updatedAt: string;
}

export interface DepositBonusV2ListResponse {
  code: number;
  data: {
    items: DepositBonusV2Data[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message: string;
}

export const depositBonusesV2API = (params?: any) => {
  const { token } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 20,
      orderby: "desc",
      columnby: "id",
      bonusType: null,
      inUse: null,
      bonusGroup: null,
      level: null,
      grade: null,
      q: null,
      ...params,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<DepositBonusV2ListResponse>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/api/deposit-bonus`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export interface DepositBonusV2SingleResponse {
  code: number;
  data: DepositBonusV2Data;
  message: string;
}

export const findDepositBonusV2API = (id: string | undefined) => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<DepositBonusV2SingleResponse>>(
      `${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  };

  return useSWR(`/api/deposit-bonus/${id}`, id ? fetcher : null);
};
