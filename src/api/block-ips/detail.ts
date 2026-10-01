import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import { DefaultResponseInterface, IpDetailData } from "../types";

// GET /ipdetail?ip=&hours= — the "should I unblock?" drill-down for one IP.
// Conditional key: no request goes out until an `ip` is actually selected.
export const useIpDetailAPI = (ip: string | null, hours: number) => {
  const token = useUserStore.getState().token;

  const fetcher = async ([url, ip, hours]: [string, string, number]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<DefaultResponseInterface<IpDetailData>>
    >(`${url}?ip=${encodeURIComponent(ip)}&hours=${hours}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR(ip ? ["/ipdetail", ip, hours] : null, fetcher);
};
