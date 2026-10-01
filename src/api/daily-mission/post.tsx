import useUserStore from "@/store/user.store";
import instance from "../axios";
import { MissionData, MissionGroupData } from "./get";
import { MissionCouponGroupItem } from "@/pages/event/daily-mission-group/MissionGroupForm";

export interface MissionBody {
  "name"          : MissionData['name'];
  "function_name" : MissionData['function_name'];
  "user_level"    : MissionData['user_level'];
  "time_limit_hours"  : MissionData['time_limit_hours'];
  "percentage"    : MissionData['percentage'];
  "is_active"     : MissionData['is_active'];
  "amount"        : MissionData['amount'];
}

export interface MissionGroupBody {
  "name"          : MissionGroupData['name'];
  "starthours"    : MissionGroupData['starthours'];
  "endhours"      : MissionGroupData['endhours'];
  "is_active"     : number;
  "fields"        : string;
}
export interface MissionGroupItemBody extends MissionCouponGroupItem {}

export const createMissionAPI = async (data: MissionBody) => {
  const token = useUserStore.getState().token;

  const res = await instance.post("/addmission", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // if (res) {
  //   mutate("/addmission");
  // }

  return res;
};
export const createMissionGroupAPI = async (data: MissionGroupBody) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post("/addmissiongroupings", {...data, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // if (res) {
  //   mutate("/addmission");
  // }

  return res;
};

export const createMissionGroupItemAPI = async (data: MissionGroupItemBody) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post("/addmissiongroupings", {...data, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // if (res) {
  //   mutate("/addmission");
  // }

  return res;
};
