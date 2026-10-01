import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";

export interface BetLogCancelData {
  id: string;
  username: string;
  betType: string;
  refunded: string;
  prevBalance: string;
  balance: string;
  status: number;
  reason: string;
}

export interface BetLogCancelRes {
  code: number;
  message: string;
  data: BetLogCancelData;
}

export const cancelBetLogAPI = (id: string, reason: string) => {
  const { token } = useUserStore.getState();
  return instance.post<undefined, AxiosResponse<BetLogCancelRes>>(
    `/betlog/${id}/cancel`,
    { reason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
