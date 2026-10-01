import useUserStore from "@/store/user.store";
import useSWR from "swr";
import instance from "../axios";
import { Strapi, StrapiRes } from "../types/strapi";
import { AxiosResponse } from "axios";

export interface SiteConfigData extends Strapi {
  displaySpecialStore: boolean;
  telegram_cs_id?: string;
  telegram_channel_id?: string;
}

export const siteConfigAPI = () => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<SiteConfigData>>
    >(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR("/api/public/site-config", fetcher);
};
