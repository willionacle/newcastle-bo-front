import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AdminAdjustmentType } from "../types/strapi";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import useWithdrawalQuery from "@/hooks/useWithdrawalQuery";
import { NXAPI, ResPostList, SWRType } from "../types";
import useStateQuery from "@/hooks/useStateQuery";
import { stringify } from "qs";
import { defaultRecordTypes } from "@/pages/user/balance-logs/TypeCheckBox";

export interface BalanceLog extends NXAPI {
  id: number;
  username: string;
  type: AdminAdjustmentType;
  amount: number;
  system_note: string;
  adminId: string;
  prev_balance: number;
  created_at: string;
  transaction_id?: string;
  game_id?: string;
  game_category?: string;
  user_regdate?: string;
  user_status?: string;
}

// 새로운 /api/balance-logs API 응답 타입
export interface BalanceLogAPI {
  id: number;
  userId: number;
  username: string;
  userRealName: string | null;
  agentUsername: string | null;
  userLevel: number | null;
  userGrade: number | null;
  amount: number;
  systemNote: string | null;
  adminId: string | null;
  createdAt: string;
  updatedAt: string;
  recordType: string | null;
  prevBalance: number | null;
  afterBalance: number | null;
  gameId: string | null;
  gameCategory: string | null;
}

export const findBalanceLog = (username?: string) => {
  console.log(window.location.pathname);
  const isWithdrawPage =
    window.location.pathname === "/payment/withdraw" ||
    window.location.pathname.includes("withdraw");
  console.log(username);
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery({
    filter: {
      userid: userid,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "created_at",
      username: null,
      type: JSON.stringify([""]),
      system_note: null,
      start_date: null,
      end_date: null,
      bti_token: isWithdrawPage ? 1 : 0,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<ResPostList[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/balancelog`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};

// 출금 상세 페이지 전용 API
export const findWithdrawalBalanceLog = (username?: string) => {
  const { token } = useUserStore.getState();
  const { paginationProps, query, setFilters } = useWithdrawalQuery({
    filter: {
      page: 1,
      limit: 100,
      orderBy: "createdAt",
      order: "DESC",
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
          items: BalanceLog[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
          };
        };
      }>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 새 API 필드명을 기존 필드명으로 매핑
    const mappedItems = res.data.data.items.map((item: any) => ({
      ...item,
      prev_balance: item.prevBalance,
      after_balance: item.afterBalance,
      record_type: item.recordType,
      system_note: item.systemNote,
      admin_id: item.adminId,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
    }));

    // 기존 API 응답 형식에 맞춰 변환
    return {
      data: mappedItems,
      totalitems: res.data.data.pagination.totalItems,
    };
  };

  const swr = useSWR(
    username ? [`/api/withdrawal/balance-logs/${username}`, query] : null,
    fetcher
  );

  // onHeaderCell은 null로 반환 (출금 페이지에서는 정렬 기능 비활성화)
  return { swr, paginationProps, onHeaderCell: null, setFilters };
};

// 새로운 Balance Logs 페이지용 API
export const balanceLogsAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "createdAt",
      username: null,
      agent: null,
      recordType: [],
      systemNote: null,
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
          items: BalanceLogAPI[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
          };
          // 서버가 인식하지 못한 recordType 라벨. 인식 못한 값이 있을 때만 내려온다.
          unmappedRecordTypes?: string[];
        };
      }>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const unmappedRecordTypes = res.data.data.unmappedRecordTypes;

    if (unmappedRecordTypes?.length) {
      console.warn(
        "[balance-logs] unmapped recordType labels (matched literally, so they return nothing):",
        unmappedRecordTypes
      );
    }

    // API 응답을 기존 형식에 맞게 변환
    return {
      data: res.data.data.items,
      totalitems: res.data.data.pagination.totalItems,
      code: res.data.code,
      message: res.data.message,
      unmappedRecordTypes,
    };
  };

  const swr = useSWR([`/api/balance-logs`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const findBalanceLogStateQuery = (username?: string) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useStateQuery({
    filter: {
      userid: userid,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "created_at",
      username,
      type: JSON.stringify([""]),
      system_note: null,
      start_date: null,
      end_date: null,
      bti_token: 0,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<ResPostList[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/balancelog`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};

export const userDownloadBalanceLogAPI = async (dateRange: "1D" | "1W" | "1M") => {
  const {token} = useUserStore.getState();

  const params = stringify({
    orderby: "desc",
    columnby: "createdAt",
    username: null,
    agent: null,
    // 화면 필터의 기본 선택값과 동일하게 유지 (엑셀과 그리드가 어긋나지 않도록)
    recordType: defaultRecordTypes.join(","),
    systemNote: null,
    dateRange,
  })

  return await instance.get<Blob>(
    `/api/balance-logs/download?${params}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};