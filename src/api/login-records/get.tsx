import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { NXAPI, SWRType } from "../types";
import { GF } from "@/utils/GlobalFunctions";

export interface LoginRecords extends NXAPI {
  ip: string;
  access_url: string;
  user_agent: string;
  login_date_time: string;
  user: string;
  is_admin: boolean | null;
  user_id?: number;
  display_color: number;
}

export interface LoginRecords2 extends NXAPI {
  ip: string;
  access_url: string;
  user_agent: string;
  login_date_time: string;
  user: string;
  is_admin: boolean | null;
  user_id?: number;
  display_color: number;
}

export const findLoginRecords = (username: string | undefined) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'id',
        username    : username,
        is_admin    : null,
        status      : null,
        start_date  : null,
        end_date    : null,
        ip          : null,
        access_url  : null,
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    console.log(query)
    const res = await instance.get<undefined, AxiosResponse<SWRType<LoginRecords[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/loginlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const adminLoginRecords = () => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery({
    filter: {
      userid      : userid,
      page				: 1,
      limit				: 100,
      orderby     : 'desc',
      columnby    : 'id',
      username    : null,
      is_admin    : 1,
      status      : null,
      start_date  : null,
      end_date    : null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<LoginRecords[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/loginlist`, query], fetcher);
  return { swr, paginationProps, onHeaderCell, setFilters };
};

export const userLoginRecords = () => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery({
    filter: {
      userid      : userid,
      page				: 1,
      limit				: 100,
      orderby     : 'desc',
      columnby    : 'id',
      username    : null,
      ip          : null,
      start_date  : `${GF.firstDayOfMonth()} 00:00:00`,
      end_date		: `${GF.lastDayOfMonth()} 23:59:59`,
      is_app_login : null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<LoginRecords2[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/loginlist2`, query], fetcher);
  return { swr, paginationProps, onHeaderCell, setFilters };
};
