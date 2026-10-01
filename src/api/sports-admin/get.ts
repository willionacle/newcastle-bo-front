import instance from "../axios";
import useUserStore from "@/store/user.store";
import { AxiosResponse } from "axios";
import { PostRes } from "../types";
import useQuery from "@/hooks/useQuery";
import useSWR from "swr";

// The three ITF boards this whole module governs — separate from the legacy
// sport_widget_v3 odds screens under src/pages/sports/*, which talk to a
// different backend (VITE_SPORTSAPI_URL) and are unaffected by any of this.
export type SportsAdminBoard = "domestic" | "international" | "special";

export interface SportsAdminBoardInfo {
  board: SportsAdminBoard;
  label: string;
  marketKeys: string[] | null;
}

export const sportsAdminBoardsAPI = () => {
  const { token } = useUserStore.getState();
  return instance.get<undefined, AxiosResponse<PostRes<SportsAdminBoardInfo[]>>>(
    "/api/sports-admin/boards",
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export interface SportsAdminOddsSide {
  side: string;
  betId: string | null;
  line: number | null;
  feedOdds: number | null;
  overrideOdds: number | null;
  effectiveOdds: number | null;
  closed: boolean;
  hidden: boolean;
  overrideId: number | null;
  reason: string | null;
}

export interface SportsAdminMarket {
  marketId: number;
  marketKey: string | null;
  marketType: string;
  rawMarketType: string;
  status: string;
  rateStatus: number;
  showStatus: number;
  standard: number | null;
  homeStandard: number | null;
  awayStandard: number | null;
  sides: SportsAdminOddsSide[];
}

export interface SportsAdminGame {
  gameId: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  gameDatetime: string;
  gameOverride: string | null;
  markets: SportsAdminMarket[];
}

export interface SportsAdminOddsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface SportsAdminOddsData {
  board: SportsAdminBoard;
  label: string;
  games: SportsAdminGame[];
  pagination: SportsAdminOddsPagination;
}

// board is a separate hook argument (not folded into the useQuery filter state)
// so switching the tab strip reruns the SWR fetch immediately — useQuery's
// filter state is only seeded on mount, it wouldn't pick up a later board change.
export const sportsAdminOddsAPI = (board: SportsAdminBoard) => {
  const { token } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters, filters } = useQuery({
    filter: {
      page: 1,
      limit: 30,
      upcomingOnly: true,
      sport: undefined,
      league: undefined,
      keyword: undefined,
      gameId: undefined,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const fetcher = async ([url, board, query]: [string, SportsAdminBoard, string]) => {
    const res = await instance.get<undefined, AxiosResponse<PostRes<SportsAdminOddsData>>>(
      `${url}?board=${board}&${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  };

  const swr = useSWR([`/api/sports-admin/odds`, board, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, filters };
};

export interface SportsAdminLimit {
  key: string;
  value: number | null;
  configured: boolean;
  description: string;
}

export const getSportsAdminLimitsAPI = () => {
  const { token } = useUserStore.getState();
  return instance.get<undefined, AxiosResponse<PostRes<SportsAdminLimit[]>>>(
    "/api/sports-admin/limits",
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export interface ComboRulePair {
  marketA: string;
  marketB: string;
}

export interface ComboRuleSport {
  sport: string;
  games: number;
}

export interface ComboRule {
  id: number;
  sport: string; // "*" = every sport
  marketA: string;
  marketB: string;
  allowed: boolean;
  message: string | null;
}

export interface ComboRulesData {
  categories: string[];
  pairs: ComboRulePair[];
  sports: ComboRuleSport[];
  rules: ComboRule[];
}

export const getComboRulesAPI = () => {
  const { token } = useUserStore.getState();
  return instance.get<undefined, AxiosResponse<PostRes<ComboRulesData>>>(
    "/api/sports-admin/combo-rules",
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
