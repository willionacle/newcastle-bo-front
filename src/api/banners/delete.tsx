import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";
import { mutate } from "swr";

export const deleteBanner = async (id: Strapi["id"]) => {
  const token = useUserStore.getState().token;

  const res = await instance.delete(`/banners/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/banners");
  }

  return res;
};
