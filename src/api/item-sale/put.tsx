import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";

export const updateItemSale = async (id: Strapi["id"]) => {
  const token = useUserStore.getState().token;

  return await instance.put(
    `/item-sales/${id}`,
    { data: { cancel: true } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
