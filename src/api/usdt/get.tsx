import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { CommonDataItemInterface, DefaultResponseInterface } from "../types";

export interface USDTExchangeRateData extends CommonDataItemInterface {
    exchange_rate: number;
}

export const getUSDTExchangeRate = () => {
  const {token, userid} = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<DefaultResponseInterface<USDTExchangeRateData>>>(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data
  };

  return useSWR(`/getexchangeratetop?userid=${userid}`, fetcher);
};
