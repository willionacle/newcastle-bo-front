import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface EventData {
  id: string
  start_date: string;
  end_date: string;
  title: string;
  in_use: boolean;
  order: number;
  image: string;
  thumbnail: string;
}

export const getEventAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "asc",
      "columnby"      : "id",
      "title"         : "",
      "in_use"        : null,
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<EventData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/eventlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};