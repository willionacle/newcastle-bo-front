import useUserStore from "@/store/user.store";
import instance from "../axios";

interface UpdateLevelupCouponStatusBody {
  logId: number;
  username: string;
}

interface UpdateLevelupCouponStatusResponse {
  code: number;
  data: {
    logId: number;
    username: string;
    isCoupon: number;
    updated: boolean;
  };
  message: string;
}

export const updateLevelupCouponStatus = async (body: UpdateLevelupCouponStatusBody) => {
  const token = useUserStore.getState().token;

  const res = await instance.patch<UpdateLevelupCouponStatusBody, UpdateLevelupCouponStatusResponse>(
    "/api/coupon/levelup-coupon-status",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};
