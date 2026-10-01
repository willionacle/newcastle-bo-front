import useUserStore from "@/store/user.store";
import instance from "../axios";
import { User } from "../users/get";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { BettingLogs } from "../betting-logs/get";
import { StrapiPagination } from "../types/strapi";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface WithdrawalDetailBetBody {
  username: User["username"] | undefined;
  gte?: string;
  lte?: string;
  vendorKey?: string;
  gameKey?: string;
  betId?: string;
  page: number;
}

export interface WidthdrawalDetailBetData {
  betLogs: BettingLogs[];
  meta: { pagination: StrapiPagination };
}

export const widthdrawalDetailBetAPI = (body: WithdrawalDetailBetBody) => {
  const token = useUserStore.getState().token;
  const { paginationProps } = useQuery();

  const fetcher = async ([url, body]: [string, WithdrawalDetailBetBody]) => {
    console.log(body);

    const res = await instance.post<
      any,
      AxiosResponse<WidthdrawalDetailBetData>
    >(
      url,
      {
        username: body.username,
        filters: {
          createdAt:
            body?.gte || body?.lte
              ? {
                  gte: body.gte,
                  lte: body.lte,
                }
              : undefined,
          vendorKey: body.vendorKey,
          gameKey: body.gameKey,
          betId: body.betId,
        },
        page: body.page,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res);

    return res.data;
  };

  return {
    swr: useSWR(
      ["custom/withdrawalsDetail/bet", body],
      body.username ? fetcher : null
    ),
    paginationProps,
  };
};

export interface WidthdrawalDetailBalanceData {
  balanceLogs: {
    id: number;
    username: string;
    type: string;
    amount: number;
    systemNote: string;
    adminId: string;
    createdAt: string;
    updatedAt: string;
    type2: null | string;
    requiredRollingPercentage: "";
    prevBalance: number;
  }[];
  meta: { pagination: StrapiPagination };
}

export interface WithdrawalDetailBalanceBody {
  username: User["username"] | undefined;
  gte?: string;
  lte?: string;
  systemNote?: string;
  type2?: string;
}

export const widthdrawalDetailBalanceAPI = (
  body: WithdrawalDetailBalanceBody
) => {
  const token = useUserStore.getState().token;
  const { paginationProps } = useQuery();

  const fetcher = async ([url, body]: [
    string,
    WithdrawalDetailBalanceBody
  ]) => {
    console.log(body);

    const res = await instance.post<
      undefined,
      AxiosResponse<WidthdrawalDetailBalanceData>
    >(
      url,
      {
        username: body.username,
        filters: {
          createdAt:
            body?.gte || body?.lte
              ? {
                  gte: body.gte,
                  lte: body.lte,
                }
              : undefined,
          systemNote: body.systemNote,
          type2: body.type2,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  return {
    swr: useSWR(
      ["custom/withdrawalsDetail/balance", body],
      body.username ? fetcher : null
    ),
    paginationProps,
  };
};

export interface WithdrawDetailTopinfoData {
    SP: {
      sum: number;
      count: number;
      win: number;
      waiting: number;
    },
    S: {
      sum: number;
      count: number;
      win: number;
    },
    C: {
      sum: number;
      count: number;
      win: number;
    },
    M: {
      sum: number;
      count: number;
      win: number;
    },
}

export interface MoneyInfoData {
  "BettingAmount": number;
  "PrevBalance": number;
  "LastDeposit": number;
  "BonusMoney": number;
  "NetLoss": number;
  "PendingBet": number;
  "WithdrawAmount": number;
  "WithdrawRequest": number;
  "Error"?: number;
}

export interface WithdrawalBetSummaryData {
  lastDepositName: string;
  lastDepositCategory: string;
  lastDepositDate: string;
  lastDepositAmount: number;
  lastBonusAmount: number;
  bonusPercentage: number;
  slotCurrentBetAmount: number;
  liveCurrentBetAmount: number;
  minigameCurrentBetAmount: number;
  sportsActiveBetAmount: number;
  sportsPendingBetAmount: number;
  sportsTotalBetAmount: number;
  prevBalance: number;
  netLoss: number;
  totalBetAmount: number;
  withdrawAmount: number;
  withdrawRequest: number;
  currentHolding: number;
  netLossAdjusted: number;
  referralPointUsed: number;
  rollingPointUsed: number;
  couponUsed: number;
  pointConversionTotal: number;
  actualWithdrawAmount: number;
  withdrawError: number;
  lastWithdrawRequestDate: string;
}

export interface WithdrawalDetailTopInfoBody {
  username: User["username"] | undefined;
  game_id?: string;
  start_date?: any;
  end_date?: any;
}

export const widthdrawalDetailTopInfoAPI = (
  username?: string
) => {
  const {token, userid} = useUserStore.getState();

  // const query = {
  //   userid: userid,
  //   username: body.username ? body.username : null,
  //   game_id: null,
  //   start_date: body.start_date ? GF.formatDate(body.start_date, true) : null,
  //   end_date: body.end_date ? GF.formatDate(body.end_date, true) : null
  // }

  const { query, setFilters } = useQuery(
    {
      filter: {
        userid: userid,
        username: username ?? null,
        game_id: null,
        start_date: null,
        end_date: null
      },
    }
  );

  const fetcher = async ([url, query]: [string, any]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<WithdrawDetailTopinfoData>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR(["userstatistics2", query], username ? fetcher : null);

  return {swr, setFilters};
};


export const withdrawalBetSummaryAPI = (username: string | undefined, startDate?: string, endDate?: string) => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<WithdrawalBetSummaryData>>>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  // Build URL with query parameters if dates are provided
  let url = username ? `/api/withdrawal/bet-summary/${username}` : null;
  if (url && startDate && endDate) {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    url = `${url}?${params.toString()}`;
  }

  return useSWR(
    url,
    username ? fetcher : null
  );
};
