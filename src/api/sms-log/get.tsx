import useQuery from "@/hooks/useQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { Strapi, StrapiRes } from "../types/strapi";
import { User } from "../users/get";
import { AxiosResponse } from "axios";
import { ResPostList, SWRType } from "../types";

export interface SmsLogData extends Strapi {
  message: string;
  phoneNumber: string;
  msg: string;
  status: string;
  userRealName: null | User["userRealName"];
  username: null | User["username"];
  verificationCode: string;
}

export const smsLogAPI = () => {
  const token = useUserStore.getState().token;
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<SmsLogData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/custom/sms-log", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};


export const SMSLogAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "columnby"      : "id",
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "desc"
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<ResPostList[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/smslog`, query], fetcher);
  console.log('SWR Get',swr)
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const depositSMSLogAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "columnby"      : "CreatedAt",
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "desc",
      "start_date"    : null,
      "end_date"      : null,
      "depositor"     : null,
      "status"        : null,
      "bank"          : null,
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<ResPostList[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/depositsmslog`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};


