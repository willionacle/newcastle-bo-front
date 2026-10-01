import CommaNumber from "@/components/CommaNumber";
import LineChart from "@/components/LineChart";
import { PartnerEarningsData } from "@/api/partners/types";
import { Card, Col, Row, Statistic, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

interface Props {
  data?: PartnerEarningsData;
  loading?: boolean;
}

const PartnerEarnings = ({ data, loading }: Props) => {
  const { t } = useTranslation();

  const periodColumns: ColumnsType<PartnerEarningsData["periods"][number]> = [
    { title: t("partnerManagement.period"), key: "period", align: "center", render: (_v, r) => `${r.periodFrom} ~ ${r.periodTo}` },
    { title: t("partnerManagement.subtreeAmount"), dataIndex: "subtreeAmount", key: "subtreeAmount", align: "center", render: (v: number) => <CommaNumber value={v} onlyNumber /> },
    {
      title: t("partnerManagement.sharePct"),
      dataIndex: "sharePct",
      key: "sharePct",
      align: "center",
      // trust the per-period share, not the top-level agent.sharePct — that's only the currently-configured value.
      render: (v: number | null) => (v == null ? "-" : <CommaNumber value={v} onlyNumber isPercentage />),
    },
    { title: t("partnerManagement.entitlement"), dataIndex: "entitlement", key: "entitlement", align: "center", render: (v: number) => <CommaNumber value={v} onlyNumber /> },
    {
      title: t("partnerManagement.netPayout"),
      dataIndex: "netPayout",
      key: "netPayout",
      align: "center",
      render: (v: number) => (
        <span style={{ fontWeight: 600 }}>
          <CommaNumber value={v} onlyNumber />
        </span>
      ),
    },
  ];

  const chartData = data
    ? {
        labels: data.daily.map((d) => d.statDate),
        datasets: [
          {
            label: t("partnerManagement.netPayout"),
            data: data.daily.map((d) => d.netPayout),
            borderColor: "#4f46e5",
            backgroundColor: "rgba(79,70,229,0.15)",
            fill: true,
          },
          {
            label: t("partnerManagement.subtreeAmount"),
            data: data.daily.map((d) => d.subtreeAmount),
            borderColor: "#94a3b8",
            backgroundColor: "rgba(148,163,184,0.1)",
            fill: false,
          },
        ],
      }
    : undefined;

  return (
    <Card size="small" loading={loading} title={t("partnerManagement.earnings")}>
      {data && (
        <>
          {/* netPayout is what the partner is actually paid, after the cascade takes the
              downline's own share out — lead with it, never with entitlement. */}
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title={t("partnerManagement.netPayout")} valueRender={() => <CommaNumber value={data.totals.netPayout} onlyNumber />} />
            </Col>
            <Col span={8}>
              <Statistic title={t("partnerManagement.entitlement")} valueRender={() => <CommaNumber value={data.totals.entitlement} onlyNumber />} valueStyle={{ color: "var(--ant-color-text-tertiary)" }} />
            </Col>
            <Col span={8}>
              <Statistic title={t("partnerManagement.subtreeAmount")} valueRender={() => <CommaNumber value={data.totals.subtreeAmount} onlyNumber />} valueStyle={{ color: "var(--ant-color-text-tertiary)" }} />
            </Col>
          </Row>

          {chartData && (
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <LineChart data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            </div>
          )}

          <Table
            style={{ marginTop: 8 }}
            rowKey="id"
            size="small"
            dataSource={data.periods}
            columns={periodColumns}
            pagination={false}
          />
        </>
      )}
    </Card>
  );
};

export default PartnerEarnings;
