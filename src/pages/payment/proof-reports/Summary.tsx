import { ProofReportSummary } from "@/api/proof-reports/get";
import DateText from "@/components/DateText";
import { Alert, Card, Col, Row, Skeleton, Statistic } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  summary: ProofReportSummary | undefined;
  loading: boolean;
}

const Summary = ({ summary, loading }: Props) => {
  const { t } = useTranslation();

  if (loading || !summary) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  const { counts, unresolved, needsAttention, oldestUnresolved, hours } =
    summary;

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              title={t("proofReport.okInWindow", { hours })}
              value={counts.ok}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              title={t("proofReport.failedInWindow", { hours })}
              value={counts.failed}
              valueStyle={
                counts.failed > 0
                  ? { color: "var(--ant-color-error-text)" }
                  : undefined
              }
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              title={t("proofReport.skippedInWindow", { hours })}
              value={counts.skipped}
              valueStyle={
                counts.skipped > 0
                  ? { color: "var(--ant-color-warning-text)" }
                  : undefined
              }
            />
          </Card>
        </Col>
        {/* 창(hours)과 무관한 전체 기간 값. 배지가 묶여 있는 숫자라 나머지
            셋과 나란히 두되 제목으로 구분한다. */}
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              title={t("proofReport.unresolvedAllTime")}
              value={unresolved}
              valueStyle={
                unresolved > 0
                  ? { color: "var(--ant-color-error-text)" }
                  : undefined
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 보간 변수 이름은 `unresolved` — `count` 는 i18next 복수형 예약어다. */}
      {needsAttention ? (
        <Alert
          style={{ marginTop: 8 }}
          type="error"
          showIcon
          message={t("proofReport.needsAttention", { unresolved })}
          description={
            oldestUnresolved ? (
              <span>
                {t("proofReport.oldestUnresolved")}:{" "}
                {oldestUnresolved.direction === "deposit"
                  ? t("col.deposit")
                  : t("topNavi.tn016")}{" "}
                #{oldestUnresolved.rowId}
                {oldestUnresolved.username
                  ? ` · ${oldestUnresolved.username}`
                  : ""}
                {` · ${(oldestUnresolved.amount ?? 0).toLocaleString()} · `}
                <DateText date={oldestUnresolved.createdAt} timeStamp />
                {oldestUnresolved.error ? ` · ${oldestUnresolved.error}` : ""}
              </span>
            ) : undefined
          }
        />
      ) : (
        // 표가 비어 있는 것과 "보고가 꺼져 있는 것"을 운영자가 헷갈리지 않도록
        // 이상 없음을 명시한다. 꺼진 사이트는 이 화면 자체가 뜨지 않는다.
        <Alert
          style={{ marginTop: 8 }}
          type="success"
          showIcon
          message={t("proofReport.allClear")}
        />
      )}
    </>
  );
};

export default Summary;
