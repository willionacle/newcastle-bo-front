import instance from "../axios";
import useUserStore from "@/store/user.store";

export interface IssueUpgradeCouponParams {
  username: string;
  grade: string;
}

export interface IssueUpgradeCouponResponse {
  code: number;
  message: string;
  data?: {
    couponId: number;
    username: string;
    grade: string;
    amount: number;
    expiredDate: string;
    issuedAt: string;
  };
}

export const issueUpgradeCoupon = async (params: IssueUpgradeCouponParams): Promise<IssueUpgradeCouponResponse> => {
  const { token } = useUserStore.getState();

  const response = await instance.post<IssueUpgradeCouponParams, { data: IssueUpgradeCouponResponse }>(
    '/api/upgrade-coupons/issue',
    params,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return response.data;
};