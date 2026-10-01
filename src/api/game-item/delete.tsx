import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";

export const deleteGameItem = async (id: Strapi["id"]) => {
  const token = useUserStore.getState().token;

  return await instance.delete(`/gameitems/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
