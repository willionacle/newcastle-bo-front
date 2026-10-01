import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";

export const updateGameItem = async (body: any, id: Strapi["id"]) => {
  const token = useUserStore.getState().token;

  const res = await instance.put<any, any>(`/gameitems/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
