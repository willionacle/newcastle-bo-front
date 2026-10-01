import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";

export const depositAccount = () => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR("/depoist-account", fetcher);
};
