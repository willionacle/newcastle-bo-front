import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";

export interface AttendanceRewardInput {
  dayNumber: number;
  amount: number;
}

export interface UpdateAttendanceRewardsResponse {
  code: number;
  message: string;
  data?: { saved: number };
}

// Full replace — send every row the grid is showing, including day numbers
// unchanged from the last save. Anything omitted is deleted server-side.
export const updateAttendanceRewards = async (rewards: AttendanceRewardInput[]) => {
  const { token } = useUserStore.getState();

  const res = await instance.put<
    { rewards: AttendanceRewardInput[] },
    AxiosResponse<UpdateAttendanceRewardsResponse>
  >(
    "/api/attendance/rewards",
    { rewards },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
