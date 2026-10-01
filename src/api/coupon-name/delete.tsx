import useUserStore from "@/store/user.store";
import instance from "../axios";
import { CouponData } from "../coupon/get";

export const deleteCouponName = async (id: CouponData["id"]) => {
  const {token, userid} = useUserStore.getState();

  return instance.post("/deletecouponname", {userid: userid, id: id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
