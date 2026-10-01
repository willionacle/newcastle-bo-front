import instance from "../axios";
import useUserStore from "@/store/user.store";

export interface UpdateGlobalConfigRequest {
  globalLevelMinimumDailyBettingAmount?: number;
  globalLevelMinimumDailyBettingAmountSlot?: number;
  globalLevelMinimumDailyBettingAmountCasino?: number;
  globalLevelMinimumDailyBettingAmountSports?: number;
  globalLevelMinimumDailyBettingAmountMiniGame?: number;
}

export const updateGlobalConfig = async (data: UpdateGlobalConfigRequest) => {
  const { token } = useUserStore.getState();
  return instance.put('/api/grade-policies/global-min-daily-betting', data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
