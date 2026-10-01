import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { PostRes } from "../types";

export interface VendorListItem {
  vendor_id: string;
  game_category: string;
}

export const useVendorList = () => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<PostRes<VendorListItem[]>>
    >(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  return useSWR("/vendorlist", fetcher);
};
