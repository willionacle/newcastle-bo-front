import { AxiosResponse } from "axios";
import useSWR from "swr";
import { stringify } from "qs";
import instance from "../axios";
import i18next from "@/i18n/i18n";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";

export type RetentionType = "frequency" | "days" | "non_deposit_days";

export interface RetentionBucket {
  label: string;
  bucket_key: string;
  user_count: number;
  ratio: number;
}

export interface DepositRetentionData {
  total_deposit_users: number;
  frequency_buckets: RetentionBucket[];
  days_buckets: RetentionBucket[];
  non_deposit_days_buckets: RetentionBucket[];
}

export interface RetentionUser {
  user_id: number;
  username: string;
  user_real_name: string;
  total_deposit: number;
  in_out_diff: number;
  tendency: string;
  last_deposit_method: string;
  main_game: string;
  grade: string;
  level: number;
}

interface DistributionRow {
  label: string;
  min: number;
  max: number;
  userCount: number;
  percentage: number;
}

interface DepositDetailsResponse {
  totalDepositUsers: number;
  depositCountDistribution: DistributionRow[];
  depositDayDistribution: DistributionRow[];
  noDepositDayDistribution: DistributionRow[];
}

interface RetentionUserRow {
  userid: number;
  username: string;
  userRealName: string;
  depositTotal: number;
  dwSum: number;
  referenceNote: string | null;
  lastDepositMethod: string | null;
  mostPlayedGameCategory: string | null;
  userGrade: number;
  userLevel: number;
  count: number;
}

interface RetentionUsersResponse {
  code: number;
  data: RetentionUserRow[];
  page: number;
  totalitems: number;
  totalpage: number;
  message: string;
}

export const API_TYPE: Record<RetentionType, "depositCount" | "depositDays" | "noDepositDays"> = {
  frequency: "depositCount",
  days: "depositDays",
  non_deposit_days: "noDepositDays",
};

/** Backend caps open-ended buckets at this value. */
const OPEN_ENDED_MAX = 999999;

/** Bucket key sent to the drill-down endpoints (backend contract). */
const bucketCode = (row: DistributionRow): string =>
  String(row.max >= OPEN_ENDED_MAX ? row.min : row.max);

type UnitKind = "count" | "day";

const unitText = (unit: UnitKind) =>
  unit === "count" ? i18next.t("unit.round", "회") : i18next.t("global.day", "일");

// The backend's `label` is ignored; build a localized label from min/max instead.
const toDisplayLabel = (row: DistributionRow, unit: UnitKind): string => {
  const u = unitText(unit);
  if (row.max >= OPEN_ENDED_MAX) {
    return i18next.t("depositRetention.orMore", "{{value}}이상", { value: `${row.min - 1}${u}` });
  }
  if (row.min === row.max) {
    return `${row.min}${u}`;
  }
  return `${row.min}~${row.max}${u}`;
};

const mapDistribution = (rows: DistributionRow[], unit: UnitKind): RetentionBucket[] =>
  rows.map((row) => ({
    label: toDisplayLabel(row, unit),
    bucket_key: bucketCode(row),
    user_count: row.userCount,
    ratio: row.percentage,
  }));

const statsFetcher = async (url: string): Promise<DepositDetailsResponse> => {
  const { token } = useUserStore.getState();
  const res = await instance.get<
    undefined,
    AxiosResponse<{ code: number; data: DepositDetailsResponse; message: string }>
  >(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.data.data;
};

/** startDate/endDate: YYYY-MM-DD. Backend rejects ranges over 366 days. */
export const useDepositRetentionStats = (startDate: string, endDate: string) => {
  const { data, isLoading } = useSWR(
    `/api/deposit-details?${stringify({ startDate, endDate })}`,
    statsFetcher
  );

  const stats: DepositRetentionData = {
    total_deposit_users: data?.totalDepositUsers ?? 0,
    frequency_buckets: mapDistribution(data?.depositCountDistribution ?? [], "count"),
    days_buckets: mapDistribution(data?.depositDayDistribution ?? [], "day"),
    non_deposit_days_buckets: mapDistribution(data?.noDepositDayDistribution ?? [], "day"),
  };

  return { data: stats, isLoading };
};

const usersFetcher = async (url: string): Promise<RetentionUsersResponse> => {
  const { token } = useUserStore.getState();
  const res = await instance.get<undefined, AxiosResponse<RetentionUsersResponse>>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const useRetentionBucketUsers = (
  type: RetentionType,
  labelCode: string,
  startDate: string,
  endDate: string,
  page: number,
  limit: number,
  columnBy?: string,
  orderBy?: "asc" | "desc"
) => {
  const query = stringify({
    page,
    limit,
    startDate,
    endDate,
    type: API_TYPE[type],
    label: labelCode,
    columnBy,
    orderBy,
  });

  const { data, isLoading } = useSWR(`/api/deposit-details/users?${query}`, usersFetcher);

  const users: RetentionUser[] = (data?.data ?? []).map((row) => ({
    user_id: row.userid,
    username: row.username,
    user_real_name: row.userRealName,
    total_deposit: row.depositTotal,
    in_out_diff: row.dwSum,
    tendency: row.referenceNote ?? "-",
    last_deposit_method: row.lastDepositMethod ?? "-",
    main_game: row.mostPlayedGameCategory ?? "-",
    grade: GF.handleGradeStrVal(row.userGrade),
    level: row.userLevel,
  }));

  return {
    users,
    page: data?.page ?? page,
    totalitems: data?.totalitems ?? 0,
    totalpage: data?.totalpage ?? 1,
    isLoading,
  };
};

/** Extract a file name from a Content-Disposition header (supports RFC 5987 filename*=UTF-8''...). */
export const fileNameFromDisposition = (disposition: unknown, fallback: string): string => {
  if (typeof disposition !== "string") return fallback;
  const m = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (!m?.[1]) return fallback;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
};

/** Excel export of a bucket's users (backend caps at 50,000 rows). */
export const downloadRetentionUsersExport = async (
  type: RetentionType,
  labelCode: string,
  startDate: string,
  endDate: string
) => {
  const { token } = useUserStore.getState();
  const query = stringify({ startDate, endDate, type: API_TYPE[type], label: labelCode });

  return instance.get<Blob>(`/api/deposit-details/users/export?${query}`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${token}` },
    silent: true,
  });
};
