import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";

export const gameStatsdAPI = () => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    return instance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return useSWR("/cs-statics/game-stats", fetcher);
};
