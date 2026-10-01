import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { SWRType } from "../types";
import { AxiosResponse } from "axios";

// GET|PUT /api/attendance/rewards — the 출석일수→보너스 ladder grid. See
// ATTENDANCE_FRONTEND_INTEGRATION.md §4.
//
// GET returns rows as stored (snake_case); PUT expects camelCase
// { dayNumber, amount } and is a FULL REPLACE — whatever is sent becomes the
// entire ladder. See put.tsx.
export interface AttendanceRewardRow {
  id: number;
  day_number: number;
  amount: number;
  is_active: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export const getAttendanceRewards = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<AttendanceRewardRow[]>>>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  const swr = useSWR(token ? "/api/attendance/rewards" : null, fetcher);

  return {
    data: swr.data?.data,
    isLoading: swr.isLoading,
    mutate: swr.mutate,
  };
};
