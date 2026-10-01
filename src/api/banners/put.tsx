import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";

export const updateBannerAPI = async (
  data: globalThis.FormData,
  id: number | undefined
) => {
  const token = useUserStore.getState().token;

  const res = await instance.put(`/banners/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/banners");
  }

  return res;
};
