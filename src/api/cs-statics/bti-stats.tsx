import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";

export interface BtiStatsData {
  ingBetSum: {
    betSum: number;
    gainSum: number;
  };
  finalizedBetSum: {
    betSum: number;
    resultSum: number;
    losingSum: number;
  };
}

export const btiStatsAPI = () => {
  const token = useUserStore.getState().token;

  console.log("test");

  const fetcher = async (url: string) => {
    const res = await instance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data as BtiStatsData;
  };

  return useSWR("/cs-statics/bti-stats", fetcher);
};
