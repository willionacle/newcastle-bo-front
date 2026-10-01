import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { SWRType } from "../types";

export interface SettingsUserListInterface {
  id: number,
  username: string,
  created_at: string
}

export interface SettingsData {
  "id": number;
  "user_list": string[] | SettingsUserListInterface[] | null;
  "global_deposit_method": number;
  "global_level_minimum_daily_betting_amount": number;
  "global_level_black_diamond": number;
  "global_level_diamond": number;
  "global_level_ruby": number;
  "global_level_emerald": number;
  "global_level_gold": number;
  "global_level_silver": number;
  "global_level_bronze": number;
  "global_usdt_deposit_mileage_onoff": boolean | number;
  "global_usdt_min_deposit_amount": number;
  "global_usdt_accumulation": number;
  "rolling_payment_live": number;
  "rolling_payment_slot": number;
  "rolling_payment_sports": number;
  "rolling_payment_minigame": number;
  "rolling_payment_fishing": number;
  "rolling_payment_board": number;
  "rolling_payment_etc": number;
  "rolling_target": number;
  "rolling_rating_bronze": number;
  "rolling_rating_silver": number;
  "rolling_rating_gold": number;
  "rolling_rating_emerald": number;
  "rolling_rating_ruby": number;
  "rolling_rating_diamond": number;
  "rolling_rating_black_diamond": number;
  "rolling_condition_bets_per_day": number;
  "rolling_condition_bets_amount_per_day": number;
  "rolling_condition_bets_per_day_onoff": boolean | number;
  "rolling_condition_bets_amount_per_day_onoff": boolean | number;
  "rolling_payment_onoff": boolean | number;
  "rolling_rating_level_1": number;
  "rolling_rating_level_2": number;
  "rolling_rating_level_3": number;
  "rolling_rating_level_4": number;
  "rolling_rating_level_5": number;
  "rolling_rating_level_6": number;
  "rolling_rating_level_7": number;
  "rolling_rating_level_8": number;
  "rolling_rating_level_9": number;
}

export const getGradeSettings = () => {
  const {token, userid} = useUserStore.getState();

  const fetcher = async (url: string) => {
    try {
      
      const res = await instance.get<undefined, AxiosResponse<SWRType<SettingsData>>>(
        `${url}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const {code, data} = res.data
  
      if (code == 0) {
        return data;
      }
    } catch (error) {
      console.error(error)
      return null;
    }

  };

  return useSWR(`getratingsetting?userid=${userid}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
};
