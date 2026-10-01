import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";

export const deleteHeroManagementAPI = async (id: Strapi["id"] | undefined) => {
  const token = useUserStore.getState().token;

  return await instance.delete(`/hero-managements/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
