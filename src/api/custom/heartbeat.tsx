import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";

export const heartbeatAPI = () => {
  const {token} = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR("/api/heartbeat", fetcher, {
    refreshInterval: 1000 * 60 * 3,
  });
};
