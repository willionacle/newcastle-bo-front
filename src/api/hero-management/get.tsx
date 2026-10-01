import useQuery from "@/hooks/useQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { SWRType } from "../types";

export interface HeroManagementData  {
  id      : number
  category: string;
  order   : number;
  inUse   : boolean;
  image_desktop : string;
  image_mobile  : string;
}

export const heroManagementAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"  : userid,
      "page"    : 1,
      "limit"   : 100,
      "orderby" : "asc",
      "in_use"  : null,
      "columnby": 'id'
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<HeroManagementData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/herolist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
