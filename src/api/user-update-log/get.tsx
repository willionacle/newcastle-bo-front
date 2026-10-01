import instance from "../axios";
import useUserStore from "@/store/user.store";
import useQuery from "@/hooks/useQuery";
import useSWR from "swr";
import { AxiosResponse } from "axios";

export interface UserUpdateLogChange {
  columnName: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface UserUpdateLogItem {
  requestId: string;
  username: string;
  userRealName: string;
  columnGroup: string;
  changes: UserUpdateLogChange[];
  changedAt: string;
  adminUsername: string | null;
  source: string | null;
}

// defaultUsername: 회원 상세 탭처럼 한 회원으로 고정해 조회할 때 사용
export const userUpdateLogAPI = (defaultUsername?: string) => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "changedAt",
      username: defaultUsername ?? null,
      userRealName: null,
      columnName: null,
      columnGroup: null,
      oldValue: null,
      newValue: null,
      adminUsername: null,
      startDate: null,
      endDate: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<{
        code: number;
        message: string;
        data: {
          items: UserUpdateLogItem[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
          };
        };
      }>
    >(`${url}?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      data: res.data.data,
      code: res.data.code,
      message: res.data.message,
    };
  };

  const swr = useSWR([`/api/user-update-log`, query], fetcher);

  return {
    swr,
    onHeaderCell,
    setFilters,
    paginationProps,
    query,
  };
};
