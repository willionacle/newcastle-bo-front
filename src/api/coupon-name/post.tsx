import useUserStore from "@/store/user.store";
import instance from "../axios";
import { PostAddRes } from "../types";
import { AxiosResponse } from "axios";

export interface CouponNameBody {
  userid?: number;
  name: string;
  coupon_content: string;
}

export interface CouponUpdateBody extends CouponNameBody {
  id: number;
  is_active: number;
}

export const createCouponName = async (body: CouponNameBody) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post<CouponNameBody, AxiosResponse<PostAddRes>>("/addcouponname", {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const updateCouponName = async (body: CouponUpdateBody) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post<CouponUpdateBody, any>("/updatecouponname", {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
