import instance from "../axios";
import useUserStore from "@/store/user.store";
import useQuery from "@/hooks/useQuery";
import useSWR from "swr";
import { GF } from "@/utils/GlobalFunctions";

export interface GradeChangeLog {
  gradeChangeId: number;
  username: string;
  oldGrade: string;
  newGrade: string;
  changedAt: string;
  isUpgrade: number;
  issueId: number | null;
  issuedAt: string | null;
  canIssueCoupon: number;
}

export interface GradeChangeLogsResponse {
  code: number;
  data: GradeChangeLog[];
  count: number;
  totalCount: number;
  page: number;
  totalPages: number;
}

export const gradeChangeLogsAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 20,
      orderby: "desc",
      columnby: "gradeChangeId",
      username: undefined,
      agentUsername: undefined,
      prevGrade: undefined,
      changeGrade: undefined,
      type: undefined, // promotion | demotion
      startDate: GF.firstDayOfMonth(),
      endDate: GF.lastDayOfMonth(),
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<any, { data: GradeChangeLogsResponse }>(`${url}?${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };

  const swr = useSWR([`/api/grade-change-logs`, query], fetcher);
  
  return { 
    swr, 
    onHeaderCell, 
    setFilters, 
    paginationProps: (totalItems: number) => paginationProps(totalItems)
  };
};