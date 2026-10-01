import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import { HighStakesCategory } from "./types";

export interface HighStakesThresholdInput {
  gameCategory: HighStakesCategory;
  amount: number;
  isActive: boolean;
}

export interface UpdateHighStakesThresholdsResponse {
  code: number;
  message: string;
  data?: { saved: number };
}

// PARTIAL update by category -- sending every row the grid shows is fine
// (nothing gets added or deleted either way, `saved` just confirms the match
// count). `gameCategory` must be copied from the GET response, never
// hand-typed -- "casino" is refused, the real key is "live". `amount` and
// `isActive` are independent: amount:0 means "unset", not "off". Never send
// `updated_by` -- it's derived server-side from the session.
export const updateHighStakesThresholds = async (thresholds: HighStakesThresholdInput[]) => {
  const { token } = useUserStore.getState();

  const res = await instance.put<
    { thresholds: HighStakesThresholdInput[] },
    AxiosResponse<UpdateHighStakesThresholdsResponse>
  >(
    "/api/high-stakes/thresholds",
    { thresholds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
