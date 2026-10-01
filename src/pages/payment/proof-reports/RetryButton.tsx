import { retryProofReportAPI } from "@/api/proof-reports/post";
import { Button, Popconfirm, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  id: number;
  onRetried: () => void;
}

const RetryButton = ({ id, onRetried }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await retryProofReportAPI(id);

      if (res.code === 0) {
        notification.success({ message: t("proofReport.retrySuccess") });
        onRetried();
        return;
      }

      // 벤더가 거절한 재전송은 오류가 아니라 업무 결과다. 사유는 서버 문구를
      // 그대로 보여준다 (번역 대상 아님).
      notification.warning({
        message: t("proofReport.retryRejected"),
        description: res.message,
      });
      onRetried();
    } catch (error: any) {
      notification.error({
        message: t("proofReport.retryFailed"),
        description: error?.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popconfirm
      title={t("proofReport.retryConfirm")}
      onConfirm={handleRetry}
      okText={t("global.confirm")}
      cancelText={t("global.cancel")}
    >
      <Button size="small" loading={loading}>
        {t("proofReport.retry")}
      </Button>
    </Popconfirm>
  );
};

export default RetryButton;
