import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { Dayjs } from "dayjs";

export interface LossingData {
  "id": number;
  "lossing_onoff": number;
  "lossing_type": string;
  "lossing_format": string;
  "lossing_payment_day": number;
  "lossing_payment_time": Dayjs | string;
  "lossing_method": number;
  "lossing_system_log": string;
  "lossing_member_selection": string;
  "lossing_rating_level_1": number;
  "lossing_rating_level_2": number;
  "lossing_rating_level_3": number;
  "lossing_rating_level_4": number;
  "lossing_rating_level_5": number;
  "lossing_rating_level_6": number;
  "lossing_rating_level_7": number;
  "lossing_rating_level_8": number;
  "lossing_rating_level_9": number;
  "lossing_rating_bronze": number;
  "lossing_rating_silver": number;
  "lossing_rating_gold": number;
  "lossing_rating_emerald": number;
  "lossing_rating_ruby": number;
  "lossing_rating_diamond": number;
  "lossing_rating_black_diamond": number;
  "lossing_coupon_validity": number;
}


export const weeklyLossingAPI = () => {
  const {token, userid} = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get(`${url}?userid=${userid}&id=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR("/getlossingconfig", fetcher);
};
