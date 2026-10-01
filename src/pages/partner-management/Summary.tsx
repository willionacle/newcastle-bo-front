import CommaNumber from "@/components/CommaNumber";
import { PartnerMoneyBucket, PartnerSummaryData } from "@/api/partners/types";
import { Card, Col, Row, Statistic, Tabs } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  data?: PartnerSummaryData;
  loading?: boolean;
}

const MoneyBucketCards = ({ bucket }: { bucket: PartnerMoneyBucket }) => {
  const { t } = useTranslation();
  const rows: [keyof PartnerMoneyBucket, string][] = [
    ["total", t("partnerManagement.total")],
    ["deposit", t("partnerManagement.deposit")],
    ["withdrawal", t("partnerManagement.withdrawal")],
  ];

  return (
    <Row gutter={[12, 12]}>
      {rows.map(([key, label]) => {
        const row = bucket[key];
        return (
          <Col span={8} key={key}>
            <Card size="small">
              <Statistic title={row.amountKo || label} value={undefined} valueRender={() => <CommaNumber value={row.amount} onlyNumber />} />
              <div style={{ fontSize: 12, color: "var(--ant-color-text-tertiary)", marginTop: 4 }}>
                {t("partnerManagement.countUnit", { count: row.count })}
              </div>
              <Row gutter={8} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <div style={{ fontSize: 12, color: "var(--ant-color-text-tertiary)" }}>{t("partnerManagement.firstBonus")}</div>
                  <CommaNumber value={row.firstBonus} onlyNumber />
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 12, color: "var(--ant-color-text-tertiary)" }}>{t("partnerManagement.reloadBonus")}</div>
                  <CommaNumber value={row.reloadBonus} onlyNumber />
                </Col>
              </Row>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

const PartnerSummary = ({ data, loading }: Props) => {
  const { t } = useTranslation();

  const memberStats: [string, number | undefined][] = data
    ? [
        [t("partnerManagement.totalSignups"), data.memberSummary.totalSignups],
        [t("partnerManagement.directSignups"), data.memberSummary.directSignups],
        [t("partnerManagement.downlineSignups"), data.memberSummary.downlineSignups],
        [t("partnerManagement.downlineActiveBettors"), data.memberSummary.downlineActiveBettors],
        [t("partnerManagement.logins"), data.memberSummary.logins],
      ]
    : [];

  const memberTotals: [string, number | undefined][] = data
    ? [
        [t("partnerManagement.totalMembers"), data.memberSummary.totalMembers],
        [t("partnerManagement.directMembers"), data.memberSummary.directMembers],
        [t("partnerManagement.downlineMembers"), data.memberSummary.downlineMembers],
      ]
    : [];

  return (
    <Card size="small" loading={loading} title={t("partnerManagement.memberSummary")}>
      <Row gutter={[16, 16]}>
        {memberStats.map(([label, value]) => (
          <Col span={4} key={label}>
            <Statistic title={label} value={value ?? 0} />
          </Col>
        ))}
      </Row>
      {/* totalMembers/*Members are current totals, range-independent — kept in a
          separate row so they don't get read as part of the range-scoped signup figures. */}
      <Row gutter={[16, 16]} style={{ marginTop: 4 }}>
        {memberTotals.map(([label, value]) => (
          <Col span={4} key={label}>
            <Statistic title={label} value={value ?? 0} valueStyle={{ fontSize: 16 }} />
          </Col>
        ))}
      </Row>

      <Tabs
        style={{ marginTop: 16 }}
        items={
          data
            ? [
                { key: "all", label: t("partnerManagement.scopeAll"), children: <MoneyBucketCards bucket={data.money.all} /> },
                { key: "downline", label: t("partnerManagement.scopeDownline"), children: <MoneyBucketCards bucket={data.money.downline} /> },
                { key: "self", label: t("partnerManagement.scopeSelf"), children: <MoneyBucketCards bucket={data.money.self} /> },
              ]
            : []
        }
      />
    </Card>
  );
};

export default PartnerSummary;
