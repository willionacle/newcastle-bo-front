import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";

export const createBannerAPI = async (data: globalThis.FormData) => {
  const token = useUserStore.getState().token;

  const res = await instance.post("/banners", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/banners");
  }

  return res;
};
