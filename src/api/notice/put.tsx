import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";

export const updateNoticeAPI = (body: any, id: Strapi["id"]) => {
  const token = useUserStore.getState().token;

  return instance.put("/notices/" + id, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
