import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { NXAPI, SWRType } from "../types";

// Coupon Usage Data
export interface CouponUsageData extends NXAPI {
  name: string;
  couponContent: string;
  amount: number;
  usageCount: number;
  userCount: number;
  type: 'coupon';
}

// Wheel Usage Data
export interface WheelUsageData {
  grade: number;
  amount: number;
  name?: string;
  usage_count: number;
  user_count: number;
  type: 'wheel';
}

// Deposit Bonus Usage Data
export interface DepositBonusUsageData extends NXAPI {
  bonusName: string;
  bonusAmount: number;
  depositAmount: number;
  bonusCountApplication: number;
  bonusCountUsed: number;
  type: 'bonus';
}

// Lossing Point Total Data (페이백)
export interface LossingPointTotalData {
  amount: number;
  usageCount: number;
  userCount: number;
  type: 'lossing-point-total';
}

// Referral Point Total Data (추천포인트)
export interface ReferralPointTotalData {
  amount: number;
  usageCount: number;
  userCount: number;
  type: 'referral-point-total';
}

export type CombinedUsageData = CouponUsageData | WheelUsageData | DepositBonusUsageData | LossingPointTotalData | ReferralPointTotalData;

// ---- User drill-down (who is behind a row's user count) ----

export interface BonusUsageUser {
  username: string;
  bonusName: string;
  totalBonusAmount: number;
  totalDepositAmount: number;
  usageCount: number;
  firstUsedAt: string;
  lastUsedAt: string;
}

export interface CouponUsageUser {
  username: string;
  couponName: string;
  totalAmount: number;
  usageCount: number;
  firstUsedAt: string;
  lastUsedAt: string;
}

export interface WheelUsageUser {
  username: string;
  grade: number;
  totalAmount: number;
  usageCount: number;
  firstUsedAt: string;
  lastUsedAt: string;
}

export interface ReferralUsageUser {
  username: string;
  totalAmount: number;
  usageCount: number;
  firstIssuedAt: string;
  lastIssuedAt: string;
}

export type LossingUsageUser = ReferralUsageUser;
export type UsageUser = BonusUsageUser | CouponUsageUser | WheelUsageUser | ReferralUsageUser;

export interface UsageUsersResult {
  users: UsageUser[];
  /** True when the backend cut the list at its 2,000-user cap. */
  truncated: boolean;
}

const USAGE_USERS_URL: Record<CombinedUsageData['type'], string> = {
  coupon: '/api/coupon/usage-users',
  wheel: '/api/wheel/usage-users',
  bonus: '/api/deposit-bonus/usage-users',
  'lossing-point-total': '/api/lossing-point/issued-users',
  'referral-point-total': '/api/referral-point/issued-users',
};

/** Users behind one combined-usage row. startDate/endDate: YYYY-MM-DD (omitted when empty). */
export const fetchUsageUsers = async (
  row: CombinedUsageData,
  startDate?: string | null,
  endDate?: string | null
): Promise<UsageUsersResult> => {
  const { token } = useUserStore.getState();

  const params: Record<string, string | number | undefined> = {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };
  if (row.type === 'coupon') params.couponName = row.name;
  if (row.type === 'wheel') params.grade = row.grade;
  if (row.type === 'bonus') params.bonusName = row.bonusName;

  const res = await instance.get<
    undefined,
    AxiosResponse<{ code: number; data: UsageUser[]; truncated?: boolean; message?: string }>
  >(USAGE_USERS_URL[row.type], {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return { users: res.data.data || [], truncated: Boolean(res.data.truncated) };
};

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

export const combinedUsageStatistics = () => {
  const { userid, token } = useUserStore.getState();

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
      let shouldFetchCoupon = false;
      let shouldFetchWheel = false;
      let shouldFetchBonus = false;
      let shouldFetchLossingPoint = false;
      let shouldFetchReferralPoint = false;

      if (!params.type || params.type === '') {
        shouldFetchCoupon = true;
        shouldFetchWheel = true;
        shouldFetchBonus = true;
        shouldFetchLossingPoint = true;
        shouldFetchReferralPoint = true;
      } else if (params.type === 'coupon') {
        shouldFetchCoupon = true;
      } else if (params.type === 'wheel') {
        shouldFetchWheel = true;
      } else if (params.type === 'bonus') {
        shouldFetchBonus = true;
      } else if (params.type === 'lossing-point-total') {
        shouldFetchLossingPoint = true;
      } else if (params.type === 'referral-point-total') {
        shouldFetchReferralPoint = true;
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

      if (shouldFetchBonus) {
        requests.push(
          instance.get<undefined, AxiosResponse<SWRType<DepositBonusUsageData[]>>>(
            `/api/deposit-bonus/usage`,
            {
              params: {
                page: 1,
                limit: 500,
                orderby: 'desc',
                columnby: 'bonus_name',
                agentUsername: params.agent_id || undefined,
                startDate: params.start_date || undefined,
                endDate: params.end_date || undefined,
                bonusName: params.name || undefined,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        );
      }

      if (shouldFetchLossingPoint) {
        requests.push(
          instance.get<undefined, AxiosResponse<SWRType<any[]>>>(
            `/api/lossing-point/issued`,
            {
              params: {
                page: 1,
                limit: 1,
                orderby: 'desc',
                columnby: 'created_at',
                agentUsername: params.agent_id || undefined,
                startDate: params.start_date || undefined,
                endDate: params.end_date || undefined,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        );
      }

      if (shouldFetchReferralPoint) {
        requests.push(
          instance.get<undefined, AxiosResponse<SWRType<any[]>>>(
            `/api/referral-point/issued`,
            {
              params: {
                page: 1,
                limit: 1,
                orderby: 'desc',
                columnby: 'created_at',
                agentUsername: params.agent_id || undefined,
                startDate: params.start_date || undefined,
                endDate: params.end_date || undefined,
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
      let bonusRes = null;
      let lossingPointRes = null;
      let referralPointRes = null;

      // 응답 배열 분해 (요청 순서대로)
      let responseIndex = 0;
      if (shouldFetchCoupon) couponRes = responses[responseIndex++];
      if (shouldFetchWheel) wheelRes = responses[responseIndex++];
      if (shouldFetchBonus) bonusRes = responses[responseIndex++];
      if (shouldFetchLossingPoint) lossingPointRes = responses[responseIndex++];
      if (shouldFetchReferralPoint) referralPointRes = responses[responseIndex++];

      const couponData = couponRes?.data.data?.map(item => ({
        ...item,
        type: 'coupon' as const
      })) || [];

      const wheelData = wheelRes?.data.data?.map(item => ({
        ...item,
        type: 'wheel' as const
      })) || [];

      const bonusData = bonusRes?.data.data?.map(item => ({
        ...item,
        type: 'bonus' as const
      })) || [];

      // 페이백 - totals만 사용하여 단일 행 생성
      const lossingPointData = lossingPointRes?.data.totals?.[0] ? [{
        amount: lossingPointRes.data.totals[0].amount,
        usageCount: lossingPointRes.data.totals[0].usageCount,
        userCount: lossingPointRes.data.totals[0].userCount,
        type: 'lossing-point-total' as const
      }] : [];

      // 추천포인트 - totals만 사용하여 단일 행 생성
      const referralPointData = referralPointRes?.data.totals?.[0] ? [{
        amount: referralPointRes.data.totals[0].amount,
        usageCount: referralPointRes.data.totals[0].usageCount,
        userCount: referralPointRes.data.totals[0].userCount,
        type: 'referral-point-total' as const
      }] : [];

      return {
        data: [...couponData, ...wheelData, ...bonusData, ...lossingPointData, ...referralPointData] as CombinedUsageData[],
        totals: [{
          amount: (couponRes?.data.totals?.[0]?.amount || 0) + (wheelRes?.data.totals?.[0]?.amount || 0),
          bonusAmount: bonusRes?.data.totals?.[0]?.bonusAmount || 0,
          depositAmount: bonusRes?.data.totals?.[0]?.depositAmount || 0,
          usageCount: (couponRes?.data.totals?.[0]?.usageCount || 0) + (wheelRes?.data.totals?.[0]?.usageCount || 0),
          userCount: (couponRes?.data.totals?.[0]?.userCount || 0) + (wheelRes?.data.totals?.[0]?.userCount || 0),
          bonusCountApplication: bonusRes?.data.totals?.[0]?.bonusCountApplication || 0,
          bonusCountUsed: bonusRes?.data.totals?.[0]?.bonusCountUsed || 0,
          lossingPointAmount: lossingPointRes?.data.totals?.[0]?.amount || 0,
          lossingPointCount: lossingPointRes?.data.totals?.[0]?.usageCount || 0,
          lossingPointUser: lossingPointRes?.data.totals?.[0]?.userCount || 0,
          referralPointAmount: referralPointRes?.data.totals?.[0]?.amount || 0,
          referralPointCount: referralPointRes?.data.totals?.[0]?.usageCount || 0,
          referralPointUser: referralPointRes?.data.totals?.[0]?.userCount || 0,
        }],
        totalitems: (couponRes?.data.totalitems || 0) + (wheelRes?.data.totalitems || 0) + (bonusRes?.data.totalitems || 0) + (lossingPointData.length) + (referralPointData.length),
      };
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      return {
        data: [] as CombinedUsageData[],
        totals: [{
          amount: 0,
          bonusAmount: 0,
          depositAmount: 0,
          usageCount: 0,
          userCount: 0,
          bonusCountApplication: 0,
          bonusCountUsed: 0,
          lossingPointAmount: 0,
          lossingPointCount: 0,
          lossingPointUser: 0,
          referralPointAmount: 0,
          referralPointCount: 0,
          referralPointUser: 0,
        }],
        totalitems: 0,
      };
    }
  };

  const swr = useSWR(`/combined-usage?${query}`, () => {
    const params = Object.fromEntries(new URLSearchParams(query));
    return fetcher(`/combined-usage`, params);
  });

  return { swr, onHeaderCell, setFilters, paginationProps };
};
