import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import { PostResponse } from "../types";
import { DepositLogs } from "../deposit-logs/get";
import { UpdatePaymentBody } from "../deposit-logs/post";

interface ExchangeRateBody {
    rate: number;
}

interface UpdateUSDTTrans {
  status        : UpdatePaymentBody['status'];
  id            : UpdatePaymentBody['id'];
  admin_id      : DepositLogs['admin_id'];
  system_note   : DepositLogs['system_note'];
}

export const addExchangeRate = async (body: ExchangeRateBody) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post<undefined, AxiosResponse<PostResponse<undefined>>>("/addexchangerate", {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const updateUSDTDeposit = async (body: UpdateUSDTTrans) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post<undefined, AxiosResponse<PostResponse<undefined>>>("/updateusdtdepositlog", {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUSDTWithdraw = async (body: UpdateUSDTTrans) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post<undefined, AxiosResponse<PostResponse<undefined>>>("/updateusdtwithdrawlog", {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
