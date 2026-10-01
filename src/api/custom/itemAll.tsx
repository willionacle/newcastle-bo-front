import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { GameItemData } from "../game-item/get";

export const findItemAllAPI = () => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<GameItemData[]>>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  return useSWR("/custom/item-all", fetcher);
};
