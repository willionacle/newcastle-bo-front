import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import {
  ApiResponse,
  ListResponse,
  Coupon,
  CouponIssueBody,
  BulkCouponIssueBody,
  BulkFilterCouponIssueBody,
  BulkFilterCouponIssueResponse,
  DummyCouponBody,
  DummyCouponResponse
} from "./types";

// 쿠폰 목록 조회
export const useLuckyWheelCoupons = (username?: string) => {
  const { token } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      username: username ? username : null,
      grade: null,
      status: null,
      dateFrom: null,
      dateTo: null,
      issuedBy: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<ListResponse<Coupon>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  const swr = useSWR([`/api/wheel/coupons`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

// 쿠폰 발급 (개별)
export const issueLuckyWheelCoupon = async (body: CouponIssueBody) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.post<any, AxiosResponse<ApiResponse<{ couponId: number }>>>(
      "/api/wheel/coupons/issue",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// 쿠폰 일괄 발급
export const bulkIssueLuckyWheelCoupons = async (body: BulkCouponIssueBody) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.post<any, AxiosResponse<ApiResponse<{
      success: boolean;
      successCount: number;
      totalCount: number;
      failedCount: number;
      couponIds?: number[];
      failedUsernames?: string[];
    }>>>(
      "/api/wheel/coupons/bulk-issue",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// 필터 기반 대량 쿠폰 발급
export const bulkIssueLuckyWheelCouponsByFilter = async (body: BulkFilterCouponIssueBody) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.post<any, AxiosResponse<ApiResponse<BulkFilterCouponIssueResponse> & { warning?: string }>>(
      "/api/wheel/coupons/bulk-issue-filter",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// 쿠폰 삭제
export const deleteLuckyWheelCoupon = async (couponId: number, reason?: string) => {
  const { token, username } = useUserStore.getState();

  if (!username) {
    throw new Error('AUTH_ERROR: 로그인 정보를 찾을 수 없습니다.');
  }

  try {
    const res = await instance.delete<any, AxiosResponse<ApiResponse<{ success: boolean }>>>(
      `/api/wheel/coupons/${couponId}`,
      {
        data: { adminId: username, reason },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// 쿠폰 만료 처리
export const expireLuckyWheelCoupon = async (couponId: number, reason?: string) => {
  const { token, username } = useUserStore.getState();

  if (!username) {
    throw new Error('AUTH_ERROR: 로그인 정보를 찾을 수 없습니다.');
  }

  try {
    const res = await instance.patch<any, AxiosResponse<ApiResponse<{ success: boolean }>>>(
      `/api/wheel/coupons/${couponId}/expire`,
      { adminId: username, reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// 더미 쿠폰 생성 (결과발급)
export const createDummyCoupon = async (body: DummyCouponBody) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.post<any, AxiosResponse<ApiResponse<DummyCouponResponse>>>(
      "/api/wheel/coupons/dummy",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// 쿠폰 상태별 통계
export const useCouponStatistics = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<ApiResponse<{
      total: number;
      available: number;
      used: number;
      expired: number;
    }>>>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  return useSWR('/api/wheel/coupons/statistics', fetcher);
};