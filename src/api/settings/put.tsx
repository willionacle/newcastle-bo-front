import useUserStore from "@/store/user.store";
import instance from "../axios";
// import { GradeFormDataProps } from "@/pages/system/grade-settings/GradeSettingsForm";
// import { USDTFormDataProps } from "@/pages/system/usdt-settings/USDTSettingsForm";
import { RollingFormDataProps } from "@/pages/system/rolling-settings/RollingSettingsForm";

// New API request body interface (camelCase fields)
export interface UpdateUserRollingRequest {
  id: number;
  rollingPaymentOnoff: number;
  rollingPaymentLive: number;
  rollingPaymentSlot: number;
  rollingPaymentSports: number;
  rollingPaymentMinigame: number;
  rollingPaymentFishing: number;
  rollingPaymentBoard: number;
  rollingPaymentEtc: number;
}

// export const updateGradeSettings = async (body: GradeFormDataProps) => {
//   const {token, userid} = useUserStore.getState();

//   return await instance.post("/updateratingsetting", {userid, ...body}, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const updateUSDTSettings = async (body: USDTFormDataProps) => {
//   const {token, userid} = useUserStore.getState();

//   return await instance.post("/updatemileagesetting", {userid, ...body}, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export const updateRollingSettings = async (body: RollingFormDataProps) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post("/updaterollingsetting", {userid, ...body}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserRolling = async (body: Partial<UpdateUserRollingRequest>) => {
  const {token} = useUserStore.getState();
  const { id, ...rollingData } = body;

  if (!id) {
    throw new Error("User ID is required");
  }

  return await instance.patch(`/api/users/${id}/rolling-settings`, rollingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
