import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";

export type SportGameMarketType = "1x2" | "handicap" | "underover";

export interface SportGameMarket {
  id?: number;
  gameId: string;
  marketType: SportGameMarketType;
  marketId: number;
  status: string;
  rateStatus: boolean;
  showStatus: boolean;
  standard: number | null;
  homeStandard: number | null;
  awayStandard: number | null;
  homeBetId: string | null;
  homeRate: number | null;
  drawBetId: string | null;
  drawRate: number | null;
  awayBetId: string | null;
  awayRate: number | null;
  overBetId: string | null;
  overRate: number | null;
  underBetId: string | null;
  underRate: number | null;
}

export interface SportGame {
  gameId: string;
  sport: string;
  league: string;
  leagueKor: string;
  leagueImage: string;
  countryKor: string;
  countryImage: string;
  homeTeam: string;
  homeTeamKor: string;
  awayTeam: string;
  awayTeamKor: string;
  gameDatetime: string;
  fetchedAt: string;
  updatedAt: string;
  markets: SportGameMarket[];
}

export const sportGamesAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 30,
      orderby: "asc",
      sport: null,
      country: null,
      league: null,
      team: null,
      keyword: null,
      gameId: null,
      marketType: null,
      startDate: null,
      endDate: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<{
        code: number;
        message: string;
        data: SportGame[];
        page: number;
        totalitems: number;
        totalpage: number;
      }>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/api/sport-games`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};
