import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { SWRType } from "../types";
import { AxiosResponse } from "axios";

export interface GradePolicyData {
  gradeId: number;
  gradeName: string;
  minUsageDays: number;
  gradeUpCoupon: number | null;
  paybackRate: number;
  maxPayback: number;
  rollingLivePct: number;
  rollingSlotPct: number;
  rollingSportsPct: number;
  rollingMinigamePct: number;
  totalAmount: number | null;
  slotAmount: number | null;
  liveAmount: number | null;
  sportsAmount: number | null;
  minigameAmount: number | null;
}

export const getGradePolicies = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<GradePolicyData[]>>>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  const swr = useSWR(
    token ? '/api/grade-policies' : null,
    fetcher
  );

  return {
    data: swr.data?.data,
    isLoading: swr.isLoading,
    mutate: swr.mutate,
  };
};
