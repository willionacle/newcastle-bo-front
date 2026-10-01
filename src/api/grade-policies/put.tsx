import instance from "../axios";
import useUserStore from "@/store/user.store";

export interface UpdateGradePolicyRequest {
  gradeId: number;
  gradeName: string;
  minUsageDays: number;
  gradeUpCoupon: number | null;
  paybackRate: number;
  maxPayback: number;
  rollingLivePct: number;
  rollingSlotPct: number;
  rollingSportsPct: number;
  rollingMinigamePct: number;
  totalAmount?: number | null;
  slotAmount?: number | null;
  liveAmount?: number | null;
  sportsAmount?: number | null;
  minigameAmount?: number | null;
}

export const updateGradePolicy = async (data: UpdateGradePolicyRequest) => {
  const { token } = useUserStore.getState();
  return instance.put('/api/grade-policies', data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
