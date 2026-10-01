import i18next from "@/i18n/i18n";
import { notification } from "antd";
import axios from "axios";
import { DepositAccountsByTypeResponse } from "@/api/deposit-account/put";

/** 응답에 들어 있는 건수만 골라 "변경 3건 · 신규 생성 1건 · 미존재 회원 2명" 형태로 만든다. */
export const describeBulkCounts = (res: DepositAccountsByTypeResponse): string => {
  const parts: string[] = [];
  const { data, totalUpdated } = res;

  if (typeof data?.requestedCount === "number") {
    parts.push(i18next.t("depoMethodBulk.countRequested", { n: data.requestedCount }));
  }
  if (typeof totalUpdated === "number") {
    parts.push(i18next.t("depoMethodBulk.countUpdated", { n: totalUpdated }));
  }
  if (typeof data?.createdCount === "number") {
    parts.push(i18next.t("depoMethodBulk.countCreated", { n: data.createdCount }));
  }
  if (typeof data?.notFoundCount === "number") {
    parts.push(i18next.t("depoMethodBulk.countNotFound", { n: data.notFoundCount }));
  }

  return parts.join(" · ");
};

/**
 * 일괄 ON/OFF 응답을 알림으로 보여주고, 실제 변경이 있었는지 반환한다.
 * - code 0 + success true  → 성공
 * - code 0 + success false → 바뀐 것이 없음 (안내, 에러 아님)
 * - code !== 0             → 실패 (알 수 없는 타입 등)
 */
export const notifyBulkResult = (res: DepositAccountsByTypeResponse): boolean => {
  const description = describeBulkCounts(res) || undefined;

  if (res.code === 0 && res.success) {
    notification.success({
      message: res.message || i18next.t("depoMethodBulk.done"),
      description,
    });
    return true;
  }

  if (res.code === 0) {
    notification.info({
      message: res.message || i18next.t("depoMethodBulk.nothingChanged"),
      description,
    });
    return false;
  }

  notification.warning({
    message: res.message || i18next.t("depoMethodBulk.failed"),
  });
  return false;
};

export const notifyBulkError = (error: unknown) => {
  console.error("Deposit account bulk error:", error);
  const serverMessage = axios.isAxiosError(error)
    ? error.response?.data?.message
    : undefined;

  notification.error({
    message: serverMessage || i18next.t("depoMethodBulk.error"),
  });
};
