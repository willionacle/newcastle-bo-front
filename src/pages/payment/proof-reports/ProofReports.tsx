import { proofReportsAPI, proofReportSummaryAPI } from "@/api/proof-reports/get";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Empty } from "antd";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import List from "./List";
import Summary from "./Summary";

const ProofReports = () => {
  const { t } = useTranslation();
  const { swr, paginationProps, onHeaderCell, setFilters } = proofReportsAPI();
  const {
    summary,
    isLoading: summaryLoading,
    mutate: mutateSummary,
  } = proofReportSummaryAPI();

  const handleRetried = () => {
    swr.mutate();
    mutateSummary();
  };

  // PROOF_SITE_CODE 가 없는 사이트는 애초에 보고를 하지 않는다. 목록을 그대로
  // 두면 "0건 보고"가 영구히 걸려 있어 의미가 없으므로 패널 전체를 감춘다.
  if (summary && !summary.reportingEnabled) {
    return (
      <Card>
        <Breadcrumb replace={t("proofReport.title")} />
        <Divider />
        <Empty description={t("proofReport.disabled")} />
      </Card>
    );
  }

  return (
    <Card>
      <Breadcrumb replace={t("proofReport.title")} />
      <Divider />
      <Summary summary={summary} loading={summaryLoading} />
      <Divider />
      <Filter setFilters={setFilters} />
      <Divider />
      <List
        data={swr.data ? swr.data.data : []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
        onRetried={handleRetried}
      />
    </Card>
  );
};

export default ProofReports;
