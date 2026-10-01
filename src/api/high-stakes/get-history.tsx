import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";
import { AxiosResponse } from "axios";
import { HighStakesCategory } from "./types";

export interface HighStakesHistoryRow {
  id: number;
  username: string;
  amount: number;
  game_category: HighStakesCategory;
  threshold: number;
  label_ko: string;
  status: number;
  created_at: string;
}

export interface HighStakesHistoryTotals {
  bets: number;
  staked: number;
}

// GET /api/high-stakes/history -- `totals` covers the whole filtered set, not
// just the current page, so it belongs in a header/summary row rather than a
// sum of visible rows. `end_date` is inclusive. Evaluated against CURRENT
// thresholds, not the ones in force when each bet was placed -- lowering a
// threshold surfaces older bets retroactively, so this list won't always
// match what actually sounded an alert at the time.
// See HIGH_STAKES_ALERT_FRONTEND_INTEGRATION.md §3.
export const highStakesHistoryListAPI = () => {
  const { token } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 20,
      orderby: "desc",
      columnby: "created_at",
      username: null,
      game_category: null as HighStakesCategory | null,
      start_date: null,
      end_date: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<
        SWRType<HighStakesHistoryRow[]> & {
          totals: HighStakesHistoryTotals;
          page: number;
          totalitems: number;
          totalpage: number;
        }
      >
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/api/high-stakes/history", query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};
