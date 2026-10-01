import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { SWRType } from "../types";
import { AxiosResponse } from "axios";

export interface GlobalConfigData {
  globalLevelMinimumDailyBettingAmount: number;
  globalLevelMinimumDailyBettingAmountSlot: number;
  globalLevelMinimumDailyBettingAmountCasino: number;
  globalLevelMinimumDailyBettingAmountSports: number;
  globalLevelMinimumDailyBettingAmountMiniGame: number;
}

export const getGlobalConfig = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<GlobalConfigData>>>(
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
    token ? '/api/grade-policies/global-min-daily-betting' : null,
    fetcher
  );

  return {
    data: swr.data?.data,
    isLoading: swr.isLoading,
    mutate: swr.mutate,
  };
};
