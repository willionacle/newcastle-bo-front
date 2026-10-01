import dayjs from "dayjs";

/** Format a date that may arrive as an ISO string or an epoch-ms number. */
export const fmtDate = (v?: string | number | null): string => {
  if (v === undefined || v === null || v === "") return "-";
  const d = dayjs(v);
  return d.isValid() ? d.format("YYYY-MM-DD HH:mm:ss") : String(v);
};

/** Format a money amount with thousands separators. */
export const fmtAmount = (v?: number | null): string =>
  typeof v === "number" && Number.isFinite(v) ? v.toLocaleString() : "-";
