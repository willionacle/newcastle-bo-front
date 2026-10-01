import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface MessageTemplateData {
  id: number
  title: string;
  message: string;
  created_at: null | string;
  created_by: null | string;
  updated_at: string;
}

export const getMessageTemplateListAPI = (filter?: any) => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "desc",
      "columnby"      : 'created_at',
      ...filter
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MessageTemplateData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/messagetemplatelist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getMessageTemplate = (id?: string) => {
  const {token, userid} = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MessageTemplateData>>>(
      `${url}?id=${id}&userid=${userid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  };

  const swr = useSWR('/getmessagetemplate', fetcher, {
    dedupingInterval: 0,
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  return { swr };
};