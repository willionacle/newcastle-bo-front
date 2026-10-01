import instance from "../axios";
import useUserStore from "@/store/user.store";
import { AxiosResponse } from "axios";
import { PostRes } from "../types";
import { SportsAdminBoard } from "./get";

export interface SaveOverridePayload {
  board: SportsAdminBoard;
  gameId: string;
  marketKey?: string; // omit = every market key
  marketType?: string; // omit = every market type
  line?: number | null; // omit = every line
  side?: string; // omit = every side
  odds?: number; // omit = keep the feed price
  closed?: boolean;
  hidden?: boolean;
  reason?: string;
}

// The target (board+gameId+marketKey+marketType+line+side) is the key — saving
// the same target twice edits that row, it never stacks a second one.
export const saveOverrideAPI = (payload: SaveOverridePayload) => {
  const { token } = useUserStore.getState();
  return instance.put<undefined, AxiosResponse<PostRes<{ id: number }>>>(
    "/api/sports-admin/overrides",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export interface SaveLimitsPayload {
  SPORTS_MAX_ODDS_SINGLE?: number;
  SPORTS_MAX_ODDS_PARLAY?: number;
  SPORTS_MAX_FOLDERS?: number;
  SPORTS_MAX_WIN_AMOUNT?: number;
  SPORTS_SAME_GAME_COMBO_ENABLED?: 0 | 1;
}

// Send only the fields being changed.
export const saveLimitsAPI = (payload: SaveLimitsPayload) => {
  const { token } = useUserStore.getState();
  return instance.put<undefined, AxiosResponse<PostRes<unknown>>>(
    "/api/sports-admin/limits",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export interface SaveComboRulePayload {
  sport?: string; // omitted/""/"*" all mean every sport
  sportKor?: string;
  marketA: string;
  marketB: string;
  allowed: boolean;
  message?: string | null;
}

export const saveComboRuleAPI = (payload: SaveComboRulePayload) => {
  const { token } = useUserStore.getState();
  return instance.put<undefined, AxiosResponse<PostRes<{ id: number }>>>(
    "/api/sports-admin/combo-rules",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
