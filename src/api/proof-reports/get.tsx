import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";

export type ProofReportStatus = "ok" | "failed" | "skipped";
export type ProofReportDirection = "deposit" | "withdrawal";

export interface ProofReport {
  id: number;
  direction: ProofReportDirection;
  /** 입출금 테이블의 행 id — 원 거래로 되돌아가는 링크에 쓴다. */
  rowId: number;
  username: string | null;
  amount: number | null;
  status: ProofReportStatus;
  /** 분쟁 시 벤더에 제시하는 참조번호 */
  vendorRef: string | null;
  error: string | null;
  attempts: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ProofReportSummary {
  hours: number;
  /** hours 로 잘린 창의 집계 — 배지를 여기에 묶으면 안 된다. */
  counts: { ok: number; failed: number; skipped: number };
  /** 전체 기간 기준 미해결 건수 (창과 무관) */
  unresolved: number;
  /** 배지는 반드시 이 값에 묶는다. unresolved 로부터 계산된다. */
  needsAttention: boolean;
  oldestUnresolved: Pick<
    ProofReport,
    "id" | "direction" | "rowId" | "username" | "amount" | "error" | "createdAt"
  > | null;
  /** PROOF_SITE_CODE 가 없는 클라이언트 사이트는 false — 패널 전체를 숨긴다. */
  reportingEnabled: boolean;
}

// 상단바는 소켓 푸시지만 이 요약은 REST 라 자체 폴링이 필요하다. 보고 실패는
// 초 단위로 급한 값이 아니므로 1분이면 충분하다.
const SUMMARY_REFRESH_MS = 60_000;

export const proofReportSummaryAPI = (hours = 24) => {
  const token = useUserStore((state) => state.token);

  const fetcher = async ([url, hours]: [string, number]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<{ code: number; message: string; data: ProofReportSummary }>
    >(`${url}?hours=${hours}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  const swr = useSWR(
    token ? ["/api/proof-reports/summary", hours] : null,
    fetcher,
    { refreshInterval: SUMMARY_REFRESH_MS }
  );

  return { summary: swr.data, isLoading: swr.isLoading, mutate: swr.mutate };
};

export const proofReportsAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "createdAt",
      status: null,
      direction: null,
      username: null,
      start_date: null,
      end_date: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<{
        code: number;
        message: string;
        data: {
          items: ProofReport[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
          };
        };
      }>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: res.data.data.items,
      totalitems: res.data.data.pagination.totalItems,
    };
  };

  const swr = useSWR([`/api/proof-reports`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};
