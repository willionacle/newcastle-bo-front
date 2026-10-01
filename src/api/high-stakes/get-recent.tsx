import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import { HighStakesCategory } from "./types";

export interface HighStakesRecentRow {
  id: number;
  username: string;
  amount: number;
  game_category: HighStakesCategory;
  game_id: string;
  bet_type: string;
  status: number;
  created_at: string;
  threshold: number;
  label_ko: string;
}

export interface HighStakesRecentResponse {
  code: number;
  message: string;
  data: HighStakesRecentRow[];
  synced: boolean;
  nextAfterId: number;
  hasMore: boolean;
  count?: number;
}

// GET /api/high-stakes/recent -- cursor-based poll, deliberately NOT an SWR
// hook (see useHighStakesAlerts, which owns the cursor + interval). Rules:
//
// 1. Call with NO afterId to get a baseline -- always data:[], synced:true.
//    Never play a sound for a synced:true response (this also covers a
//    cursor snapping back after the table was cleared/restored).
// 2. Pass nextAfterId back as `afterId` on every later call.
// 3. Store nextAfterId from EVERY response, even an empty one -- it's the id
//    scanned up to, not the last id returned, so skipping the empty-response
//    case makes the cursor stick and rescans the same range forever.
// 4. hasMore:true means the page was full -- poll again immediately instead
//    of waiting for the next tick.
//
// See HIGH_STAKES_ALERT_FRONTEND_INTEGRATION.md §2.
export const getHighStakesRecent = async (afterId?: number) => {
  const { token } = useUserStore.getState();

  const res = await instance.get<undefined, AxiosResponse<HighStakesRecentResponse>>(
    "/api/high-stakes/recent",
    {
      params: afterId != null ? { afterId } : undefined,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
