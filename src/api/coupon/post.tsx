import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR, { mutate } from "swr";
import { User } from "../users/get";
import { AxiosResponse } from "axios";
import { parse } from "qs";
import { SWRType } from "../types";

export interface CouponBody {
  userid: number;
  coupon_name: string;
  system_note: string;
  amount: number;
  expired_date: string | null;
  username: string[];
  status?: User["status"];
  is_used: number
}

export interface BetCouponData {
  "id": string,
  "coupon_name": string,
  "system_note": string,
  "amount": number,
  "is_used": number,
  "created_at": string,
  "updated_at": string | null,
  "expired_date": string,
  "username": string,
  "created_by_id": number,
  "updated_by_id": number | null
}

export const createCoupon = async (body: CouponBody) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<CouponBody, any>("/addcoupon", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/addcoupon");
  }

  return res;
};

export const betCouponLogAPI = (data: {system_note: string}) => {
  const { token, userid } = useUserStore.getState();
  const query = `userid=${userid}&system_note=${data.system_note}`;
  // const params = {
  //   userid,
  //   system_note: data.system_note,
  // }

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.post<any, AxiosResponse<SWRType<BetCouponData>>>(
      `${url}`,
      parse(query),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
 return useSWR([`/getcouponlog`, query], fetcher);
};
