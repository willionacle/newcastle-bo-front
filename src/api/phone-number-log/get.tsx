import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { Strapi } from "../types/strapi";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface PhoneNumberLog extends Strapi {
  queriedUsername: string;
  queriedAccountName: string;
  queriedPhoneNumber: string;
  requestingUsername: string;
  requestingAccountName: string;
}

export const getPhoneNumberLog = () => {
  const {token, userid} = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "desc",
      columnby: 'id'
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<PhoneNumberLog[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/phonelog", query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};
