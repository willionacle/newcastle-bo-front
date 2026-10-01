import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";

export interface UpdateLevelConfigBody {
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
}

export const updateLevelConfig = async (
  id: Strapi["id"] | undefined,
  body: UpdateLevelConfigBody
) => {
  const token = useUserStore.getState().token;

  return await instance.put(
    `/level-configs/${id}`,
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
