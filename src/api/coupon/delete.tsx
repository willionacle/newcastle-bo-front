import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";

export const deleteCoupons = async (id: Strapi["id"]) => {
  const {token, userid} = useUserStore.getState();

  return instance.post("/deletecoupon", {userid: userid, id: id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
