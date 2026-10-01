import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface MessageData {
  id: number
  message_body: string;
  message_title: string;
  read_date_time: null | string;
  receiver_username: string;
}

export const getMessageAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "desc",
      "columnby"      : 'created_at'
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MessageData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/messagelist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
