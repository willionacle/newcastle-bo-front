import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { NXAPI, SWRType } from "../types";

export interface CouponUsageData extends NXAPI {
  name: string;
  couponContent: string;
  amount: number;
  usageCount: number;
  userCount: number;
  type: 'coupon';
}

export interface WheelUsageData {
  grade: number;
  amount: number;
  name?: string;
  usage_count: number;
  user_count: number;
  type: 'wheel';
}

export type CombinedUsageData = CouponUsageData | WheelUsageData;

export const useCouponNames = () => {
  const { token } = useUserStore.getState();

  const fetcher = async () => {
    try {
      const response = await instance.get<undefined, AxiosResponse<{ code: number; message: string; data: string[] }>>(
        `/api/coupon/names`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch coupon names:', error);
      return [];
    }
  };

  const swr = useSWR('/api/coupon/names', fetcher);
  return swr;
};

export const couponUsageStatistics = () => {
  const { userid, token } = useUserStore.getState()

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
      userid,
      page: 1,
      limit: 1000,
      orderby: 'desc',
      columnby: 'amount',
      agent_id: null,
      start_date: null,
      end_date: null,
      type: null,
      name: null,
      }
    }
  );

  const fetcher = async (_url: string, params: any) => {
    try {
      // Determine which APIs to call based on type and name
      let shouldFetchCoupon = false;
      let shouldFetchWheel = false;

      if (!params.type || params.type === '') {
        // "전체" selected - always fetch both (name filter disabled in UI)
        shouldFetchCoupon = true;
        shouldFetchWheel = true;
      } else if (params.type === 'coupon') {
        shouldFetchCoupon = true;
      } else if (params.type === 'wheel') {
        shouldFetchWheel = true;
      }

      const requests = [];

      if (shouldFetchCoupon) {
        requests.push(
          instance.get<undefined, AxiosResponse<SWRType<CouponUsageData[]>>>(
            `/api/coupon/usage`,
            {
              params: {
                page: 1,
                limit: 1000,
                orderby: 'desc',
                columnby: 'amount',
                agentUsername: params.agent_id || undefined,
                startDate: params.start_date || undefined,
                endDate: params.end_date || undefined,
                name: params.name || undefined,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        );
      }

      if (shouldFetchWheel) {
        requests.push(
          instance.get<undefined, AxiosResponse<SWRType<WheelUsageData[]>>>(
            `/api/wheel/usage`,
            {
              params: {
                page: 1,
                limit: 1000,
                orderby: 'asc',
                columnby: 'grade',
                agentUsername: params.agent_id || undefined,
                startDate: params.start_date || undefined,
                endDate: params.end_date || undefined,
                grade: params.name || undefined,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        );
      }

      const responses = await Promise.all(requests);

      let couponRes = null;
      let wheelRes = null;

      if (shouldFetchCoupon && shouldFetchWheel) {
        [couponRes, wheelRes] = responses;
      } else if (shouldFetchCoupon) {
        [couponRes] = responses;
      } else if (shouldFetchWheel) {
        [wheelRes] = responses;
      }

      const couponData = couponRes?.data.data?.map(item => ({
        ...item,
        type: 'coupon' as const
      })) || [];

      const wheelData = wheelRes?.data.data?.map(item => ({
        ...item,
        type: 'wheel' as const
      })) || [];

      return {
        data: [...couponData, ...wheelData] as CombinedUsageData[],
        totals: [{
          amount: (couponRes?.data.totals?.[0]?.amount || 0) + (wheelRes?.data.totals?.[0]?.amount || 0),
          usageCount: (couponRes?.data.totals?.[0]?.usageCount || 0) + (wheelRes?.data.totals?.[0]?.usageCount || 0),
          userCount: (couponRes?.data.totals?.[0]?.userCount || 0) + (wheelRes?.data.totals?.[0]?.userCount || 0),
        }],
        totalitems: (couponRes?.data.totalitems || 0) + (wheelRes?.data.totalitems || 0),
      };
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      return {
        data: [] as CombinedUsageData[],
        totals: [{ amount: 0, usageCount: 0, userCount: 0 }],
        totalitems: 0,
      };
    }
  };

  const swr = useSWR(`/coupon-wheel-usage?${query}`, () => {
    const params = Object.fromEntries(new URLSearchParams(query));
    return fetcher(`/coupon-wheel-usage`, params);
  });

  return { swr, onHeaderCell, setFilters, paginationProps };
};
