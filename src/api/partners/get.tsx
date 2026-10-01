import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { stringify } from "qs";
import {
  PartnerApiEnvelope,
  PartnerEarningsData,
  PartnerMembersResponse,
  PartnerScope,
  PartnerSummaryData,
  PartnerTreeData,
} from "./types";

export interface PartnerDateRange {
  from?: string | null; // YYYY-MM-DD
  to?: string | null; // YYYY-MM-DD — inclusive
}

const authHeaders = (token?: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// §1 — GET /api/partners/tree — already nested/sorted; recurse on children, don't assume 3 levels.
export const usePartnerTreeAPI = () => {
  const { token } = useUserStore.getState();

  const fetcher = async ([url]: [string]) => {
    const res = await instance.get<PartnerApiEnvelope<PartnerTreeData>>(url, authHeaders(token));
    return res.data;
  };

  return useSWR(["/api/partners/tree"], fetcher);
};

// §2 — GET /api/partners/:agentId/summary?from=&to=
export const usePartnerSummaryAPI = (agentId?: number | null, range?: PartnerDateRange) => {
  const { token } = useUserStore.getState();
  const query = stringify(range ?? {});

  const fetcher = async ([url, q]: [string, string]) => {
    const res = await instance.get<PartnerApiEnvelope<PartnerSummaryData>>(`${url}?${q}`, authHeaders(token));
    return res.data;
  };

  return useSWR(agentId ? [`/api/partners/${agentId}/summary`, query] : null, fetcher);
};

// §3 — GET /api/partners/:agentId/members?from=&to=&scope=&page=&limit=
export const usePartnerMembersAPI = (
  agentId?: number | null,
  range?: PartnerDateRange,
  scope: PartnerScope = "all",
  page = 1,
  limit = 50
) => {
  const { token } = useUserStore.getState();
  const query = stringify({ ...range, scope, page, limit });

  const fetcher = async ([url, q]: [string, string]) => {
    const res = await instance.get<PartnerMembersResponse>(`${url}?${q}`, authHeaders(token));
    return res.data;
  };

  return useSWR(agentId ? [`/api/partners/${agentId}/members`, query] : null, fetcher);
};

// §4 — GET /api/partners/:agentId/earnings?from=&to= — lead with netPayout, not entitlement.
export const usePartnerEarningsAPI = (agentId?: number | null, range?: PartnerDateRange) => {
  const { token } = useUserStore.getState();
  const query = stringify(range ?? {});

  const fetcher = async ([url, q]: [string, string]) => {
    const res = await instance.get<PartnerApiEnvelope<PartnerEarningsData>>(`${url}?${q}`, authHeaders(token));
    return res.data;
  };

  return useSWR(agentId ? [`/api/partners/${agentId}/earnings`, query] : null, fetcher);
};
