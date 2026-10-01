import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";

// Per-leg settlement for a stuck ITF sports parlay (see cancel.ts for the
// sibling admin action on the same ticket). Only bet_type "itf_parlay" /
// "itf_intl_parlay" / "itf_special_parlay" (see CANCELLABLE_BET_TYPES in
// pages/betting/record/List.tsx) can be settled this way — the backend
// refuses anything else with "Only ITF sports slips ... can be settled per leg."

export type ItfLegResult = "PENDING" | "WON" | "LOST" | "VOID";

export interface ItfLeg {
  legNo: number;
  gameId: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  gameDatetime: string;
  marketType: string;
  selection: string;
  line: number | null;
  odds: number;
  result: ItfLegResult; // effective verdict — manual wins over feed
  feedResult: ItfLegResult; // what the settlement cron computed
  manualResult: "WON" | "LOST" | "VOID" | null; // what an admin decided
  manualBy: string | null;
  manualNote: string | null;
  manualAt: string | null;
  decided: boolean;
  homeScore: number | null;
  awayScore: number | null;
  settledAt: string | null;
}

export interface ItfTicketDetail {
  id: number;
  username: string;
  gameId: string;
  gameKey: string;
  amount: string;
  oddsTotal: number;
  expectedAmount: string;
  status: number;
  manualStatus: number | null;
  settleable: boolean; // enables the 정산 button
  undecidedLegs: number;
  projectedResult: "WIN" | "LOSE" | "REFUND" | null;
  projectedPayout: string | null;
  legs: ItfLeg[];
}

export interface BetLogDetailRes {
  code: number;
  message: string;
  data: ItfTicketDetail;
}

export const getBetLogDetailAPI = (id: string | number) => {
  const { token } = useUserStore.getState();
  return instance.get<undefined, AxiosResponse<BetLogDetailRes>>(`/betlog/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export interface SettleLegPayload {
  result: "WON" | "LOST" | "VOID";
  reason?: string;
  autoSettle?: boolean; // false = record a verdict without moving money
  homeScore?: number;
  awayScore?: number;
}

export interface SettleLegData {
  legNo: number;
  legResult: "WON" | "LOST" | "VOID";
  ticketSettled: boolean;
  ticketResult?: "WIN" | "LOSE" | "REFUND";
  paid?: string;
  balance?: string;
  ticket: ItfTicketDetail; // re-render straight from this, no second fetch
}

export interface SettleLegRes {
  code: number;
  message: string;
  data: SettleLegData;
}

export const settleLegAPI = (id: string | number, legNo: number, payload: SettleLegPayload) => {
  const { token } = useUserStore.getState();
  return instance.post<undefined, AxiosResponse<SettleLegRes>>(
    `/betlog/${id}/legs/${legNo}/settle`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export interface SettleTicketPayload {
  reason?: string;
}

export const settleTicketAPI = (id: string | number, payload: SettleTicketPayload) => {
  const { token } = useUserStore.getState();
  return instance.post<undefined, AxiosResponse<{ code: number; message: string; data: ItfTicketDetail }>>(
    `/betlog/${id}/settle`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
