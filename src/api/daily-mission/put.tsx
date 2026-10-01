import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";
import { MissionGroupData } from "./get";
import { MissionCouponGroupItem } from "@/pages/event/daily-mission-group/MissionGroupForm";

export interface MissionGroupUpdate extends Partial<MissionGroupData> {}

export const updateMissionAPI = async (
  data: globalThis.FormData,
) => {
  const token = useUserStore.getState().token;

  const res = await instance.put(`/updatemission`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/missionlist");
  }

  return res;
};

export const updateMissionGroupAPI = async (
  data: MissionGroupUpdate,
) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post(`/updatemissiongroupings`, {...data, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const updateMissionGroupItemAPI = async (
  data: MissionCouponGroupItem,
) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post(`/updatemissiongroupings`, {...data, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
