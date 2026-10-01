import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import { SWRType } from "../types";
import useSWR from "swr";

export const getResultLink = (id: number) => {
  const {token, userid} = useUserStore.getState();

  const fetcher = async (url: string) => {

    const res = await instance.post<
      undefined,
      AxiosResponse<SWRType<{url: string}>>
    >(`${url}`,
      {
        "id"                            : id,
        "userid"                        : userid
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  };
  
  return useSWR(`/resultlink`, id ? fetcher : null);
};

export const getMGResultLink = (payload: {username: string; betid: string}) => {
  const {token} = useUserStore.getState();

  const fetcher = async (url: string) => {

    const res = await instance.post<
      undefined,
      AxiosResponse<SWRType<{url: string}>>
    >(`${url}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  };
  
  return useSWR(`${import.meta.env.VITE_GAMEAPI_URL}/transfer/mg/betdetails`, payload ? fetcher : null);
};
