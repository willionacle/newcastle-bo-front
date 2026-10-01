import useUserStore from "@/store/user.store";
import { MissionCouponGroupItem } from "@/pages/event/daily-mission-group/MissionGroupForm";
import instance from "@/api/axios";
import { MissionCouponItem } from "./get";


export const updateMissionCouponAPI = async (
  type: MissionCouponGroupItem['item_type'],
  data: MissionCouponItem,
) => {
  const {token, userid} = useUserStore.getState();

  const updateAPIURL = type === 'mission' ? '/updatemission' : '/updatemissioncoupon';

  const res = await instance.post(updateAPIURL, {...data, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
