import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { NXAPI, SWRType } from "../types";

export interface WhiteListData extends NXAPI {
  ip: string;
  username: string;
}

export const whiteListDataAPI = (query: string) => {
  const token = useUserStore.getState().token;

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<WhiteListData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR(["/whiteiplist", query], query === "" ? null : fetcher);
};
