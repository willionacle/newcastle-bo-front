import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { ResPostList } from "../types";
export interface SumAndCount {
  sum: number;
  count: number;
}

export interface DwStatusData {
  deposit: {
    today: SumAndCount;
    last30Days: SumAndCount;
    last90Days: SumAndCount;
    thisWeek: SumAndCount;
    total: SumAndCount;
  };
  withdrawal: {
    today: SumAndCount;
    last30Days: SumAndCount;
    last90Days: SumAndCount;
    thisWeek: SumAndCount;
    total: SumAndCount;
  };
  rolling: {
    today: SumAndCount;
    last30Days: SumAndCount;
    last90Days: SumAndCount;
    thisWeek: SumAndCount;
    total: SumAndCount;
  };
  win: {
    today: SumAndCount;
    last30Days: SumAndCount;
    last90Days: SumAndCount;
    thisWeek: SumAndCount;
    total: SumAndCount;
  };
}



export const dwStatusAPI = (username: any) => {
  const { token } = useUserStore.getState();

  const fetcher = async ([url, query]: [string, string | undefined]) => {
    if (!query) return null;

    const res = await instance.get<undefined, AxiosResponse<ResPostList['data']>>(
      `${url}/${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  return useSWR(["/api/user-stats", username], fetcher);
};

export const dwStatusNewAPI = (username: any) => {
  const { token } = useUserStore.getState();

  const fetcher = async ([url, query]: [string, string | undefined]) => {
    if (!query) return null;

    const res = await instance.get<undefined, AxiosResponse<ResPostList['data']>>(
      `${url}/${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  return useSWR(["/api/user-stats/new", username], fetcher);
};
