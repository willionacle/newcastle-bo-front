import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { SWRType } from "../types";
import { AxiosResponse } from "axios";
import { HighStakesCategory } from "./types";

// GET|PUT /api/high-stakes/thresholds -- the 게임별 배팅금액 grid (client
// request 20-1). Unlike the attendance rewards grid, PUT here is a PARTIAL
// UPDATE BY CATEGORY: it can only edit these five existing rows, never
// add/delete them. Always send `gameCategory` back verbatim from this GET
// response -- see put-thresholds.tsx. `data2.anyActive` says whether any
// threshold is currently live; use it instead of deriving it from the rows.
// See HIGH_STAKES_ALERT_FRONTEND_INTEGRATION.md §1.
export interface HighStakesThresholdRow {
  id: number;
  game_category: HighStakesCategory;
  label_ko: string;
  amount: number;
  is_active: number;
  sort_order: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface HighStakesThresholdsData2 {
  anyActive: boolean;
}

export const getHighStakesThresholds = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<HighStakesThresholdRow[]> & { data2: HighStakesThresholdsData2 }>
    >(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  const swr = useSWR(token ? "/api/high-stakes/thresholds" : null, fetcher);

  return {
    data: swr.data?.data,
    anyActive: swr.data?.data2?.anyActive ?? false,
    isLoading: swr.isLoading,
    mutate: swr.mutate,
  };
};
