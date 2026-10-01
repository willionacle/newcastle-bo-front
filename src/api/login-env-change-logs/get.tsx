import instance from "../axios";
import useUserStore from "@/store/user.store";
import useQuery from "@/hooks/useQuery";
import useSWR from "swr";

export interface LoginEnvChangeLog {
  id: number;
  username: string;
  userId: number;
  userRealName: number;
  browser: string;
  os: string;
  device: string;
  ip: string;
  prevBrowser: string;
  prevOs: string;
  prevDevice: string;
  vAccount1InUse: boolean | null;
  vAccount2InUse: boolean | null;
  vAccount3InUse: boolean | null;
  vAccount4InUse: boolean | null;
  vAccount5InUse: boolean | null;
  vAccount6InUse: boolean | null;
  status: boolean;
  isWhitelist: boolean;
  changeReason: string;
  createdAt: string;
  updatedAt: string;
  lastDepositDate: string;
  userGradeDay:number;
  localGradeConfig: string
}

export interface LoginEnvChangeLogsResponse {
  code: number;
  message: string;
  data: {
    items: LoginEnvChangeLog[];
    pagination: {
      currentPage: number;
      totalItems: number;
      totalPages: number;
      itemsPerPage: number;
    };
  };
}

export const loginEnvChangeLogsAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "DESC",
      columnby: "created_at",
      username: null,
      status: null,
      hasVAccount: "true",
      startDate: null,
      endDate: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<any, { data: LoginEnvChangeLogsResponse }>(
      `${url}?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  };

  const swr = useSWR([`/api/login-env-change-logs/list`, query], fetcher);

  return {
    swr,
    onHeaderCell,
    setFilters,
    paginationProps: (totalItems: number) => paginationProps(totalItems),
  };
};
