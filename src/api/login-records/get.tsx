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

/** Member login row from REST GET /api/login-list (handoff §5). */
export interface LoginRecords2 extends NXAPI {
  ip: string;
  access_url: string;
  user_agent: string;
  login_date_time: string;
  user: string;
  is_admin: boolean | null;
  user_id?: number;
  display_color: number;
  is_app_login: number;
  user_real_name: string;
  /** Stored geo JSON (`{"country":"KR",...}`) on this platform, not an IP. */
  geo_location: string | null;
  /** Readable location text added by the backend, e.g. "KR 11 Seoul". */
  ip_location: string | null;
  status: number;
  /** 1 = IP used by more than one member account, ever (all-time, not range-bound). */
  has_duplicate_ip: number;
}

/** GET /api/login-list/users-by-ip item. */
export interface UserByIp {
  user: string;
  user_real_name: string;
  user_id: number;
  /** Text status: ACTIVE, SUSPENDED, ... (not a number on this backend) */
  user_status: string | null;
  last_login_at: string | null;
  login_count?: number;
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

interface LoginListRes {
  code: number;
  message: string;
  data: {
    items: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

/**
 * 회원 관리 > 로그인내역. REST GET /api/login-list (member logins only).
 * Dates are YYYY-MM-DD and end_date is inclusive. only_duplicate_ip defaults to
 * true (nxseam behaviour); group_by_user=true -> one row per member (latest login).
 */
export const userLoginRecords = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery({
    filter: {
      page              : 1,
      limit             : 100,
      orderby           : 'DESC',
      columnby          : 'created_at',
      user              : null,
      ip                : null,
      start_date        : GF.firstDayOfMonth(),
      end_date          : GF.lastDayOfMonth(),
      is_app_login      : null,
      only_duplicate_ip : true,
      group_by_user     : false,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<LoginListRes>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const items = Array.isArray(res.data?.data?.items) ? res.data.data.items : [];
    // The mapper accepts snake_case or camelCase for each field.
    const mappedItems: LoginRecords2[] = items.map((item: any) => ({
      id              : item.id,
      created_at      : item.created_at ?? item.createdAt,
      updated_at      : item.updated_at ?? item.updatedAt,
      ip              : item.ip,
      access_url      : item.access_url ?? item.accessUrl,
      user_agent      : item.user_agent ?? item.userAgent,
      login_date_time : item.login_date_time ?? item.loginDateTime,
      user            : item.user,
      is_admin        : item.is_admin ?? item.isAdmin,
      user_id         : item.user_id ?? item.userId,
      display_color   : 0,
      is_app_login    : item.is_app_login ?? item.isAppLogin,
      user_real_name  : item.user_real_name ?? item.userRealName,
      geo_location    : item.geo_location ?? item.geoLocation ?? null,
      ip_location     : item.ip_location ?? item.ipLocation ?? null,
      status          : item.status,
      has_duplicate_ip: Number(item.has_duplicate_ip ?? item.hasDuplicateIp ?? 0),
    }));

    return {
      data: mappedItems,
      totalitems: res.data?.data?.pagination?.totalItems ?? 0,
    };
  };

  const swr = useSWR([`/api/login-list`, query], fetcher);
  return { swr, paginationProps, onHeaderCell, setFilters };
};

export const getUsersByIp = async (ip: string): Promise<UserByIp[]> => {
  const { token } = useUserStore.getState();
  const res = await instance.get<
    undefined,
    AxiosResponse<{ code: number; message: string; data: UserByIp[] }>
  >(`/api/login-list/users-by-ip?ip=${encodeURIComponent(ip)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};
