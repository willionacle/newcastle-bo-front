import i18next from "@/i18n/i18n";
/**
 * Back-office API for the TiketPay Sport Widget v3 sportsbook.
 *
 * Reads from the BO backend (VITE_API_URL). The backend persists v3 tickets /
 * settlements / bonuses from the TiketPay callbacks and proxies/signs the
 * outbound Bonus API. Endpoint contract: see
 * .claude/plans/sports-integration/BACKEND-ENDPOINTS.md (§9 "Admin endpoints").
 */
import useSWR from "swr";
import { AxiosResponse } from "axios";

import instance from "../axios";
import { PostRes, SWRType } from "../types";
import useUserStore from "@/store/user.store";
import useQuery from "@/hooks/useQuery";

/* ------------------------------------------------------------------ types */

/** Ticket status values, derived from the callback lifecycle. */
export type SportsV3TicketStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "settled"
  | "cashout";

export interface SportsV3Selection {
  event_name?: string;
  sport_name?: string;
  market_name?: string;
  odd_name?: string;
  odd_value?: string;
  /** open | win | loss | void | refund | dead-heat ... */
  result?: string;
}

export interface SportsV3Ticket {
  ticket_id: string;
  user_id: string;
  username?: string;
  currency: string;
  /** stake */
  amount: number;
  /** main | free_bet | bonus */
  amount_type: string;
  /** single, double, accumulator, system ... */
  bet_type?: string;
  /** real | virtual | lottery */
  category?: string;
  status: SportsV3TicketStatus | string;
  /** total odds */
  odds?: number;
  payout?: number;
  selections_count?: number;
  created_at?: string | number;
  settled_at?: string | number;
}

export interface SportsV3CashoutRecord {
  ip?: string;
  amount: number;
  percent: number;
  date: number;
  stake: number;
}

export interface SportsV3TicketDetail extends SportsV3Ticket {
  selections: SportsV3Selection[];
  payout_info?: { bets: number; value: number; return: number; unit_stake: number };
  result?: {
    open: boolean;
    correction: boolean;
    result: number;
    cashout: number;
    pay: number;
    bonus_percent: number;
    bonus_amount: number;
  };
  cashout_history?: SportsV3CashoutRecord[];
}

export interface SportsV3Settlement {
  ticket_id: string;
  user_id: string;
  username?: string;
  /** result | cashout */
  type: "result" | "cashout" | string;
  amount_type: string;
  currency?: string;
  /** amount credited/debited to the user (result.pay / cashout.pay) */
  pay: number;
  result?: number;
  cashout?: number;
  open?: boolean;
  correction?: boolean;
  created_at?: string | number;
}

export interface SportsV3Bonus {
  /** user bonus id */
  id: string;
  user_id: string;
  username?: string;
  /** free_bet | sport_bonus */
  type: string;
  currency: string;
  /** open | active | expire | close | complete | pre-* */
  status: string;
  amount: number;
  created_at?: string | number;
}

export interface SportsV3BonusTemplate {
  bonus_id: string;
  name?: string;
  type: string;
  active?: boolean;
}

export interface IssueSportsV3BonusBody {
  bonus_id: string;
  bonus_type: string;
  user_id: string;
  currency: string;
  amount: number;
  language?: string;
}

/* ----------------------------------------------------------- filter labels */

export const SPORTS_V3_TICKET_STATUS_OPTIONS = [
  { label: i18next.t("col.all"), value: "" },
  { label: i18next.t("sportsV3.statusPending"), value: "pending" },
  { label: i18next.t("sportsV3.statusAccepted"), value: "accepted" },
  { label: i18next.t("sportsV3.statusRejected"), value: "rejected" },
  { label: i18next.t("sportsV3.statusCancelled"), value: "cancelled" },
  { label: i18next.t("sportsV3.statusSettled"), value: "settled" },
  { label: i18next.t("sportsV3.statusCashout"), value: "cashout" },
];

export const SPORTS_V3_BONUS_STATUS_OPTIONS = [
  { label: i18next.t("col.all"), value: "" },
  { label: "open", value: "open" },
  { label: "active", value: "active" },
  { label: "expire", value: "expire" },
  { label: "close", value: "close" },
  { label: "complete", value: "complete" },
];

/* --------------------------------------------------------------- list hooks */

const authGet = <T,>(token: string) => async ([url, query]: [string, string]) => {
  const res = await instance.get<undefined, AxiosResponse<SWRType<T>>>(
    `${url}?${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/** Paginated ticket list. Pass `presetUsername` to lock it to one member. */
export const useSportsV3Tickets = (presetUsername?: string) => {
  const { token } = useUserStore.getState();
  const { query, paginationProps, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "created_at",
      username: presetUsername ?? null,
      ticket_id: null,
      status: null,
      start_date: null,
      end_date: null,
    },
  });

  const swr = useSWR(
    [`/sports-v3/tickets`, query],
    authGet<SportsV3Ticket[]>(token)
  );

  return { swr, paginationProps, setFilters, query };
};

/** Settlement / cashout history. */
export const useSportsV3Settlements = (presetUsername?: string) => {
  const { token } = useUserStore.getState();
  const { query, paginationProps, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "created_at",
      username: presetUsername ?? null,
      ticket_id: null,
      type: null,
      start_date: null,
      end_date: null,
    },
  });

  const swr = useSWR(
    [`/sports-v3/settlements`, query],
    authGet<SportsV3Settlement[]>(token)
  );

  return { swr, paginationProps, setFilters, query };
};

/** User bonus list. */
export const useSportsV3Bonuses = (presetUsername?: string) => {
  const { token } = useUserStore.getState();
  const { query, paginationProps, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "created_at",
      username: presetUsername ?? null,
      status: null,
      type: null,
    },
  });

  const swr = useSWR(
    [`/sports-v3/bonuses`, query],
    authGet<SportsV3Bonus[]>(token)
  );

  return { swr, paginationProps, setFilters, query };
};

/* ------------------------------------------------------------ single fetches */

export const useSportsV3TicketDetail = (ticketId?: string) => {
  const { token } = useUserStore.getState();
  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<PostRes<SportsV3TicketDetail>>>(
      url,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  };
  return useSWR(ticketId ? `/sports-v3/tickets/${ticketId}` : null, fetcher);
};

export const sportsV3BonusTemplatesAPI = async () => {
  const { token } = useUserStore.getState();
  const res = await instance.get<undefined, AxiosResponse<PostRes<SportsV3BonusTemplate[]>>>(
    `/sports-v3/bonus-templates`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const issueSportsV3BonusAPI = async (body: IssueSportsV3BonusBody) => {
  const { token } = useUserStore.getState();
  return instance.post<IssueSportsV3BonusBody, AxiosResponse<PostRes<{ bonus_id?: string }>>>(
    `/sports-v3/bonuses`,
    body,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const cancelSportsV3BonusAPI = async (bonusId: string) => {
  const { token } = useUserStore.getState();
  return instance.delete<undefined, AxiosResponse<PostRes<unknown>>>(
    `/sports-v3/bonuses/${bonusId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
