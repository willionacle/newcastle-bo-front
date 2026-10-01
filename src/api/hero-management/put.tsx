import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";

export const updateHeroManagementAPI = async (
  body: any,
  id: Strapi["id"] | undefined
) => {
  const token = useUserStore.getState().token;

  return await instance.put(`/hero-managements/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
