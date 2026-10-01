import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { ResPostList, SWRType } from "../types";
import { GF } from "@/utils/GlobalFunctions";
import useStateQuery from "@/hooks/useStateQuery";

export interface BettingLogs  {
  [x: string]: any;
  transaction_id: string;
  created_at: string | null;
  user_id: string;
  username: string;
  game_id: string;
  amount: number;
  bet_data: string;
  transaction_dd: string;
  status: number;
  session: string | null;
  bet_result: number;
  rolling_point: number | null;
  rolling_point_percentage: number | null;
  bet_amount: number | null;
  game_category: string;
  bet_date: string | null;
}
export type SportWidgetV3LegResult = "PENDING" | "WON" | "LOST" | "CANCELLED" | "DRAW";

export interface SportWidgetV3Leg {
  legNo: number;
  gameId: string;
  sport: string;
  league: string | null;
  homeTeam: string;
  awayTeam: string;
  gameDatetime: string;
  marketType: string;
  selection: string;
  odds: number;
  line: number | null;
  result: SportWidgetV3LegResult;
  homeScore: number | null;
  awayScore: number | null;
  settledAt: string | null;
}

export interface BetLogData  {
  "id": string;
  "user_id": number;
  "username": string;
  "game_history": string;
  "game_type": string;
  "game_division": string;
  "bet_amount": number;
  "win_amount": number;
  "win_loss": number;
  "rolling_points": number;
  "rolling_rate": number;
  "betting_category": number;
  "status": string;
  "bet_date": string;
  "transaction_id": string;
  "bet_details": string;
  "bet_top_details": string;
  "bet_data": string;
  "game_name": string;
  "req_id": string;
  "session": string;
  "game_key": string;
  "bet_detail_result": string;
  "bet_data_2": string;
  "created_at": string;
  "updated_at": string;
  "result_json": string;
  "bet_data_1": string;
  "reserve_id": string;
  "bet_type": string;
  "user_real_name"?: string;
  "legs"?: SportWidgetV3Leg[];
  "match_color"?: string[];
  "match_color_name"?: {
    name: string;
    color: string;
  }[];
}

export const bettingLogsAPI = () => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'bet_date',
        username    : null,
        game_id     : null,
        start_date  : null,
        end_date		: null,
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
  
  const swr = useSWR([`/bethistorylist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const userBettingLogsAPI = () => {
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
        game_id     : null,
        start_date  : null,
        end_date		: null,
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
  
  const swr = useSWR([`/bettinglog`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const findBettingDetailAPI = async (transactionKey: string) => {
  const { token } = useUserStore.getState();

  return instance.post<any, AxiosResponse<{ url: string }>>(
    "/nexus/detailurl",
    {
      transactionKey,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export interface EvoSideBets {
  BAC_PlayerPair: number;
  BAC_BankerPair: number;
  BAC_PerfectPair: number;
  BAC_EitherPair: number;
  BAC_PlayerBonus: number;
  BAC_BankerBonus: number;
  BAC_SuperSix: number;
}

export interface Evo {
  PlayerName: string;
  StartDateGmt9: string; 
  EndDateGmt9: string;   

  TotalPlayerBets: number;
  TotalBankerBets: number;
  TotalTieBets: number;
  TotalSideBets: number;

  SideBets: EvoSideBets;
}

export interface MatchColor {
    "transaction_id": string
    "match_name": string[]
    "match_color": string[]
}

export interface BetLogType extends SWRType<BetLogData[]> {
  total: {
    bet_amount: BetLogData['bet_amount'];
    win_amount: BetLogData['win_amount'];
    win_loss: BetLogData['win_loss'];
    maximum_result: number;
    maximum_odds: number;
    maximum_bet: number;
    single_folder_ratio_pct: number;
    single_bet_ox: "X" | "O";
    single_bet_O_count: number;
    single_bet_X_count: number;
    slot_maximum_result: number;
    slot_maximum_odds: number;
    slot_maximum_bet: number;
    live_maximum_result: number;
    live_maximum_odds: number;
    live_maximum_bet: number;
    minigame_maximum_result: number;
    minigame_maximum_odds: number;
    minigame_maximum_bet: number;
    sports_maximum_result: number;
    sports_maximum_odds: number;
    sports_maximum_bet: number;
    single_bet_o_count: number;
    single_bet_x_count: number;
    evo: Evo;
    color_data: MatchColor[];
  }
}

export const betLogsAPI = () => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'bet_date',
        username    : null,
        game_id     : null,
        start_date  : null,
        end_date		: null,
        date_str		: "updated_at",
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<BetLogType>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/betlog`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const userBetLogsAPI = (username?: string) => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'bet_date',
        username    : username ?? null,
        game_id     : null,
        start_date  : `${GF.formatDate(new Date(), false)} 00:00:00`,
        end_date		: `${GF.formatDate(new Date(), false)} 23:59:59`,
        date_str		: "updated_at",
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<BetLogType>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/betlog`, query], username ? fetcher : null);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

// list state only managed query (not persisted with URL search params)
export const userBetLogsAPIStateQuery = (username?: string) => {
  const { token, userid } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useStateQuery(
    {
      filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'bet_date',
        username    : username ?? null,
        game_id     : null,
        start_date  : `${GF.formatDate(new Date(), false)} 00:00:00`,
        end_date		: `${GF.formatDate(new Date(), false)} 23:59:59`,
        date_str		: "updated_at",
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<BetLogType>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/betlog`, query], username ? fetcher : null);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};