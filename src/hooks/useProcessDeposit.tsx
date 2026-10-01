import { DepositLogs } from "@/api/deposit-logs/get";
import { useMemo } from "react";
import dayjs from "dayjs";

const AUTO_STATUSES = new Set([1, 2, 5]);

// this is for request #77: highlight duplicate SMS and manual deposit request within 60 seconds
// changed to 3mins 03-15-2026
export function useDepositDuplicateCheck(data: DepositLogs[]) {
  return useMemo(() => {
    if (!data?.length) return [];

    const sorted = [...data].sort(
      (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
    );

    return data.map((current) => {
      const createdAt = dayjs(current.created_at);

      const match = sorted.find((prev) => {
        if (prev.id === current.id) return false;
        if (dayjs(prev.created_at).valueOf() >= createdAt.valueOf()) return false;
        if (prev.user_id !== current.user_id) return false;
        if (prev.amount !== current.amount) return false;
        if (prev.status !== "Completed") return false;

        const isManual = !AUTO_STATUSES.has(prev.auto_process_status ?? -1);
        if (!isManual) return false;

        const diff = createdAt.diff(dayjs(prev.updated_at), "second");
        return diff >= 0 && diff <= 180;
      });

      return {
        ...current,
        is_green: !!match,
      };
    });
  }, [data]);
}
