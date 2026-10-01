import useUserStore from "@/store/user.store";
import instance from "../axios";

export interface CreateLevelConfigBody {
  depositRequired: string;
  levelUpMileage: string;
  maximumLossingAmount: string;
  mileagePercentage: number;
  rollingCasinoPercentage: number | null;
  rollingMiniGamePercentage: number;
  rollingRequired: string;
  rollingSlotPercentage: number;
  rollingSportsPercentage: number;
  weeklyLossingPercentage: number;
  level: number;
}

export const createLevelConfig = async (body: CreateLevelConfigBody) => {
  const token = useUserStore.getState().token;

  return await instance.post(
    `/level-configs`,
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
