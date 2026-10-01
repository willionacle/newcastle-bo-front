import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";
import { useState } from "react";
import { PaginationProps, TableColumnGroupType, TableColumnType } from "antd";
import { stringify } from "qs";

export interface UserDailyStatsData {
  [x: string]: any;
  total_bet_sum: number;
  total_bonus: number;
  total_bw_sum: number;
  total_cancel_sum: number;
  total_coupon_sum: number;
  total_deposit_bonus_sum: number;
  total_deposit_count: number;
  total_deposit_sum: number;
  total_dw_sum: number;
  total_lossing_point_sum: number;
  total_referral_point_sum: number;
  total_rolling_point_sum: number;
  total_win_sum: number;
  total_withdrawal_count: number;
  total_withdrawal_sum: number;
  username: string;
  initial_deposit: number;
  initial_withdrawal: number;
}

export interface UserDailyStatsTotal {
  total_deposit_sum: number;
  total_deposit_count: number;
  total_withdrawal_sum: number;
  total_withdrawal_count: number;
  total_bet_sum: number;
  total_win_sum: number;
  total_cancel_sum: number;
  total_rolling_point_sum: number;
  total_lossing_point_sum: number;
  total_referral_point_sum: number;
  total_coupon_sum: number;
  total_deposit_bonus_sum: number;
  total_dw_sum: number;
  total_bw_sum: number;
  total_bonus: number;
  total_balance: number;
  total_u_deposit_sum: number;
  total_u_deposit_count: number;
  total_u_deposit_bonus_sum_usdt: number;
  total_u_withdrawal_count: number;
  total_u_withdrawal_sum: number;
  total_u_withdrawal_sum_usdt: number;
}

export const userDailyStatsAPI = () => {
  const { userid, token } = useUserStore.getState();

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid,
      page: 1,
      limit: 5000,
      orderby: "desc",
      columnby: "roll_90",
      username: null,
      start_date: null,
      end_date: null,
      game_category:""
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<UserDailyStatsData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };
  const swr = useSWR([`/compressedbyuser`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};

/** Backend refuses a /compressedbyuser `usernames` filter with more names than this. */
export const MAX_USERNAMES_FILTER = 2000;

export interface UserDailyStatsModalFilters {
  username: string | null;
  usernames: string | null;
  account_name: string | null;
  status: string | null;
  level: number | string | null;
  start_date: string | null;
  end_date: string | null;
  game_category: string;
}

interface UseUserDailyStatsModalParams {
  /** Comma-joined usernames to restrict the stats to (max MAX_USERNAMES_FILTER). */
  usernames: string;
  startDate?: string | null;
  endDate?: string | null;
}

/** Drop null/undefined so the body only carries filters that are actually set. */
const compact = (obj: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined));

const postFetcher = async ([url, body]: [string, string]) => {
  const { token } = useUserStore.getState();
  const res = await instance.post<undefined, AxiosResponse<SWRType<UserDailyStatsData[]>>>(
    url,
    JSON.parse(body),
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/**
 * Standalone /compressedbyuser variant for a modal: filters/sort/paging live in local state
 * instead of the URL, so it never clashes with the host page's own query params.
 * Uses POST with a JSON body because `usernames` can hold up to 2,000 names (too long for a GET URL).
 */
export const useUserDailyStatsModal = ({ usernames, startDate, endDate }: UseUserDailyStatsModalParams) => {
  const { userid } = useUserStore.getState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(Number(import.meta.env.VITE_DEFALUT_PAGESIZE) || 100);
  const [sort, setSort] = useState({ columnby: "roll_90", orderby: "desc" });
  const [filters, setFilters] = useState<UserDailyStatsModalFilters>({
    username: null,
    usernames: usernames || null,
    account_name: null,
    status: null,
    level: null,
    start_date: startDate || null,
    end_date: endDate || null,
    game_category: "",
  });

  const applyFilters = (patch: Partial<UserDailyStatsModalFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  // Category switch also resets the sort column the same way the page's GameCategoryBtn does.
  const setGameCategory = (game_category: string) => {
    setFilters((prev) => ({ ...prev, game_category }));
    setSort({ columnby: game_category === "live" ? "dw_sum" : "roll_90", orderby: "desc" });
    setPage(1);
  };

  const body = JSON.stringify(
    compact({
      userid,
      page,
      limit,
      orderby: sort.orderby,
      columnby: sort.columnby,
      ...filters,
    })
  );

  const swr = useSWR(usernames ? [`/compressedbyuser`, body] : null, postFetcher);

  const changeSortKey = (key: string) => {
    setSort((prev) =>
      prev.columnby === key
        ? { columnby: key, orderby: prev.orderby === "desc" ? "asc" : "desc" }
        : { columnby: key, orderby: "desc" }
    );
    setPage(1);
  };

  const onHeaderCell = <T,>(column: TableColumnType<T> | TableColumnGroupType<T>) => ({
    onClick: () => changeSortKey(column.key as string),
  });

  const paginationProps = (total: number | undefined): PaginationProps => ({
    current: page,
    pageSize: limit,
    total,
    pageSizeOptions: [10, 50, 100, 300, 500],
    showSizeChanger: true,
    onChange: (newPage: number, newPageSize: number) => {
      if (newPageSize !== limit) {
        setLimit(newPageSize);
        setPage(1);
      } else {
        setPage(newPage);
      }
    },
  });

  return { swr, onHeaderCell, paginationProps, filters, applyFilters, setGameCategory };
};

interface UseTop10UsersParams {
  startDate?: string | null;
  endDate?: string | null;
  open: boolean;
}

/**
 * TOP10 depositors for the selected period across all game categories (game_category "").
 * Same GET /compressedbyuser call as the page, with limit 10 sorted by deposit_sum.
 * Only fetches while the modal is open.
 */
export const useTop10Users = ({ startDate, endDate, open }: UseTop10UsersParams) => {
  const { userid, token } = useUserStore.getState();

  const query = stringify(
    {
      userid,
      page: 1,
      limit: 10,
      orderby: "desc",
      columnby: "deposit_sum",
      start_date: startDate ?? null,
      end_date: endDate ?? null,
      game_category: "",
    },
    { skipNulls: true }
  );

  const fetcher = async ([url, q]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<UserDailyStatsData[]>>>(
      `${url}?${q}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  };

  const swr = useSWR(open ? [`/compressedbyuser`, query] : null, fetcher);

  return { swr };
};
