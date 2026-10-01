import useStateQuery from "@/hooks/useStateQuery";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { SWRType } from "../types";

export interface DepositMethodListParams {
  status?: number;
  type?: string;
  q?: string;
  is_detailed?: string;
}

export interface DepositMethodItem {
  id: number;
  type: string;
  title: string;
  status: number;
  displayName: string;
  isInput?: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  memo?: string;
  showMemo?: number;
  created_at: string;
  updated_at: string;
}

export interface DepositMethodListResponse {
  code: number;
  message: string;
  data: DepositMethodItem[];
}

export interface DepositMethodUser {
  id: number;
  userRealName: string;
  name: string;
  status: number | string;
  grade: string;
  level: number;
  no?: number;
  username?: string;
  deposit_method?: string;
  user_id?: number;
}

const fetcher = async (key: string) => {
  const { token } = useUserStore.getState();
  const urlParams = new URLSearchParams(key.split('?')[1]);

  // query parameters 구성
  const queryParams = new URLSearchParams();

  if (urlParams.get('status')) {
    queryParams.append('status', urlParams.get('status')!);
  }
  if (urlParams.get('type')) {
    queryParams.append('type', urlParams.get('type')!);
  }
  if (urlParams.get('q')) {
    queryParams.append('q', urlParams.get('q')!);
  }
  if (urlParams.get('is_detailed')) {
    queryParams.append('is_detailed', urlParams.get('is_detailed')!);
  }

  const response = await instance.get<DepositMethodListResponse>(
    `/api/deposit-methods?${queryParams.toString()}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return response.data;
};

export const useDepositMethodList = (params?: Partial<DepositMethodListParams>) => {
  const query = new URLSearchParams();

  if (params?.status !== undefined) query.append('status', params.status.toString());
  if (params?.type) query.append('type', params.type);
  if (params?.q) query.append('q', params.q);
  if (params?.is_detailed) query.append('is_detailed', params.is_detailed);

  const { data, error, mutate, isLoading } = useSWR(
    `/api/deposit-methods?${query.toString()}`,
    fetcher
  );

  return {
    data: data?.data || [],
    error,
    mutate,
    isLoading,
  };
};

export const depositMethodUserListStateQuery = (depositMethod?: string) => {
  const { token } = useUserStore.getState();

  const { onHeaderCell, paginationProps, query, setFilters } = useStateQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "DESC",
      columnby: "grade",
      type: depositMethod,
      username: null,
      user_real_name: null,
      user_status: null,
      grade: null,
      level: null,
    },
  });  

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<DepositMethodUser[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/api/deposit-methods/details`, query], depositMethod ? fetcher : null);

  return { swr, paginationProps, onHeaderCell, setFilters };
};

export const downloadDepositMethodUsers = async (method:string) => {
  const {token} = useUserStore.getState();

  return await instance.get<Blob>(
    `/api/deposit-methods/download?method=${method}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};