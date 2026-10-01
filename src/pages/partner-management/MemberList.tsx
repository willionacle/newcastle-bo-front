import CommaNumber from "@/components/CommaNumber";
import CommaNumber2 from "@/components/CommaNumber2";
import DateTextKR from "@/components/DateTextKR";
import MemberStatus from "@/components/MemberStatus";
import { PartnerMember, PartnerScope } from "@/api/partners/types";
import { Segmented, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

interface Props {
  data?: PartnerMember[];
  loading?: boolean;
  scope: PartnerScope;
  onScopeChange: (scope: PartnerScope) => void;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number, limit: number) => void;
}

// registeredAt/lastLoginAt may carry microseconds — trim to whole seconds before display.
const toKstDisplay = (value: string | null) => (value ? value.slice(0, 19) : null);

const MemberList = ({ data, loading, scope, onScopeChange, page, limit, total, onPageChange }: Props) => {
  const { t } = useTranslation();

  const columns: ColumnsType<PartnerMember> = [
    { title: t("ID"), dataIndex: "username", key: "username", align: "center" },
    { title: t("col.name"), dataIndex: "realName", key: "realName", align: "center" },
    {
      title: t("col.agent"),
      dataIndex: "agentName",
      key: "agentName",
      align: "center",
      // agentId is a string (up_users.global_agent_id is VARCHAR) — display only, no arithmetic needed here.
      render: (value: string, record) => value || record.agentId || "-",
    },
    { title: t("col.level"), dataIndex: "level", key: "level", align: "center" },
    { title: t("col.grade"), dataIndex: "grade", key: "grade", align: "center" },
    {
      title: t("col.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: string) => <MemberStatus value={value} />,
    },
    {
      title: t("col.balance"),
      dataIndex: "balance",
      key: "balance",
      align: "center",
      // balance is a decimal string straight from the DB column — cast before formatting.
      render: (value: string) => <CommaNumber value={Number(value)} onlyNumber />,
    },
    {
      title: t("partnerManagement.registeredAt"),
      dataIndex: "registeredAt",
      key: "registeredAt",
      align: "center",
      render: (value: string) => <DateTextKR date={toKstDisplay(value)} timeStamp />,
    },
    {
      title: t("partnerManagement.lastLoginAt"),
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      align: "center",
      render: (value: string | null) => <DateTextKR date={toKstDisplay(value)} timeStamp />,
    },
    {
      title: t("col.depositAmount"),
      dataIndex: "depositAmount",
      key: "depositAmount",
      align: "center",
      render: (value: number, record) => (
        <>
          <CommaNumber value={value} onlyNumber />
          <div style={{ fontSize: 12, color: "var(--ant-color-text-tertiary)" }}>
            {t("partnerManagement.countUnit", { count: record.depositCount })}
          </div>
        </>
      ),
    },
    {
      title: t("col.withdrawalAmount"),
      dataIndex: "withdrawalAmount",
      key: "withdrawalAmount",
      align: "center",
      render: (value: number, record) => (
        <>
          <CommaNumber value={value} onlyNumber />
          <div style={{ fontSize: 12, color: "var(--ant-color-text-tertiary)" }}>
            {t("partnerManagement.countUnit", { count: record.withdrawalCount })}
          </div>
        </>
      ),
    },
    {
      title: t("partnerManagement.netAmount"),
      dataIndex: "netAmount",
      key: "netAmount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.betAmount"),
      dataIndex: "betAmount",
      key: "betAmount",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
    {
      title: t("partnerManagement.winLoss"),
      dataIndex: "winLoss",
      key: "winLoss",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
  ];

  return (
    <>
      <Segmented
        style={{ marginBottom: 12 }}
        value={scope}
        onChange={(value) => onScopeChange(value as PartnerScope)}
        options={[
          { label: t("partnerManagement.scopeAll"), value: "all" },
          { label: t("partnerManagement.scopeDownline"), value: "downline" },
          { label: t("partnerManagement.scopeSelf"), value: "self" },
        ]}
      />
      <Table
        rowKey="id"
        dataSource={data ?? []}
        columns={columns}
        loading={loading}
        tableLayout="auto"
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          onChange: onPageChange,
        }}
      />
    </>
  );
};

export default MemberList;
