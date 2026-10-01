import useUserStore from "@/store/user.store";
import { MissionCouponGroupItem } from "@/pages/event/daily-mission-group/MissionGroupForm";
import instance from "@/api/axios";
import { MissionCouponItem } from "./get";

export const createMissionCouponAPI = async (
  type: MissionCouponGroupItem['item_type'],
  data: MissionCouponItem,
) => {
  const {token, userid} = useUserStore.getState();

  const createAPIURL = type === 'mission' ? '/addmission' : '/addmissioncoupon';

  const res = await instance.post(createAPIURL, {...data, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
