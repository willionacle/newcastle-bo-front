import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";
import { AxiosResponse } from "axios";

// GET /api/attendance/logs — who claimed what. `totals` covers the whole
// filtered set, not the current page. `end_date` is inclusive; `username`
// is a partial match. See ATTENDANCE_FRONTEND_INTEGRATION.md §5.
export interface AttendanceLogRow {
  id: number;
  username: string;
  attend_date: string;
  day_number: number;
  amount: number;
  rollover_required: number;
  created_at: string;
}

export interface AttendanceLogTotals {
  claims: number;
  paid: number;
}

export const attendanceLogsListAPI = () => {
  const { token } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 20,
      orderby: "desc",
      columnby: "attend_date",
      username: null,
      start_date: null,
      end_date: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<AttendanceLogRow[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR(["/api/attendance/logs", query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};
