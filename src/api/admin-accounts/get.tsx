import { AxiosResponse } from "axios";
import useSWR from "swr";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import useQuery from "@/hooks/useQuery";

// One back office admin account (backend ADMIN_ACCOUNT_INTEGRATION.md).
//
// `status` is up_users.user_status — login requires exactly "ACTIVE", so
// anything else means the account cannot log in. `level` is admin_level, which
// the agent screens own; it is shown here for context and is NOT the tier.
// The tier is `isSuperAdmin` and nothing else writes it.
export interface AdminAccount {
  id: number;
  username: string;
  name: string | null;
  role: string;
  level: number | null;
  status: string;
  isSuperAdmin: boolean;
  twofaEnrolled: boolean;
  lastLogin: string | null;
  createdAt: string | null;
}

// The doc fixes the envelope ({ code, message, data }) but not the pagination
// shape, and this backend uses two of them: a bare array in `data` with
// `totalitems` beside it (inquiry-templates), or rows nested under
// `data.items` / `data.list` with `data.total`. Both are read through
// readListPage below, so the screens don't care and a mismatch against the live
// API is a one-function fix rather than a rewrite of every caller.
interface ListEnvelope<T> {
  code: number;
  message: string;
  data: T[] | { items?: T[]; list?: T[]; total?: number } | null;
  page?: number;
  totalitems?: number;
  totalpage?: number;
}

export type AdminAccountListRes = ListEnvelope<AdminAccount>;

export const readListPage = <T,>(res?: ListEnvelope<T>): { rows: T[]; total: number } => {
  const data = res?.data;

  if (Array.isArray(data)) {
    return { rows: data, total: res?.totalitems ?? data.length };
  }

  const rows = data?.items ?? data?.list ?? [];
  return { rows, total: data?.total ?? res?.totalitems ?? rows.length };
};

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export const adminAccountsListAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: { page: 1, limit: 50 },
  });

  const fetcher = async ([url, q]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<AdminAccountListRes>>(
      `${url}?${q}`,
      { headers: { Authorization: `Bearer ${token}` }, silent: true }
    );

    return res.data;
  };

  const swr = useSWR(["/api/admin-accounts", query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};

// ---------------------------------------------------------------------------
// Audit trail
// ---------------------------------------------------------------------------

export type AdminAuditAction =
  | "CREATE"
  | "PASSWORD"
  | "PASSWORD_SELF"
  | "DISABLE"
  | "ENABLE"
  | "GRANT_SUPER"
  | "REVOKE_SUPER";

// `actor` is "masterkim(김철수)" when the employee supplied 담당자 at login,
// and the bare account name when they did not. Admin accounts are shared, so the
// account id alone does not identify a person — render the label, not the id.
//
// `detail` is the server's own sentence for the row ("transferred super admin;
// demoted masterjulius"). A transfer writes one REVOKE_SUPER per demoted admin
// plus one GRANT_SUPER, all on the same timestamp, and this is what tells those
// rows apart.
export interface AdminAuditRow {
  id: number;
  action: AdminAuditAction;
  actor: string | null;
  targetUsername: string | null;
  detail: string | null;
  ip: string | null;
  createdAt: string;
}

export type AdminAuditListRes = ListEnvelope<AdminAuditRow>;

export const adminAuditListAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: { page: 1, limit: 50 },
  });

  const fetcher = async ([url, q]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<AdminAuditListRes>>(
      `${url}?${q}`,
      { headers: { Authorization: `Bearer ${token}` }, silent: true }
    );

    return res.data;
  };

  const swr = useSWR(["/api/admin-accounts/audit", query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};
