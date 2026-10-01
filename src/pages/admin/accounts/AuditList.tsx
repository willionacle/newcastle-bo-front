import { Table, TableProps, Tag } from "antd";
import { useTranslation } from "react-i18next";
import DateText from "@/components/DateText";
import { AdminAuditAction, AdminAuditRow } from "@/api/admin-accounts/get";

// Destructive actions read red, restorative green, the rest neutral.
const ACTION_COLOR: Record<AdminAuditAction, string | undefined> = {
  CREATE: "blue",
  PASSWORD: undefined,
  PASSWORD_SELF: undefined,
  DISABLE: "red",
  ENABLE: "green",
  GRANT_SUPER: "gold",
  REVOKE_SUPER: "red",
};

interface Props {
  data: AdminAuditRow[];
  loading: boolean;
  pagination: TableProps<AdminAuditRow>["pagination"];
  onHeaderCell: any;
}

const AuditList = ({ data, loading, pagination, onHeaderCell }: Props) => {
  const { t } = useTranslation();

  const columns: TableProps<AdminAuditRow>["columns"] = [
    {
      title: t("adminAccounts.auditTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      onHeaderCell,
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("adminAccounts.action"),
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (value: AdminAuditAction) => (
        <Tag color={ACTION_COLOR[value]}>{t(`adminAccounts.actions.${value}`, value)}</Tag>
      ),
    },
    {
      // Admin accounts are shared — two employees sign in to the same one — so
      // the account name alone does not identify a person. This is the 담당자
      // the employee typed at login, recorded as "masterkim(김철수)".
      title: t("adminAccounts.actor"),
      dataIndex: "actor",
      key: "actor",
      align: "center",
      render: (value: string | null) => value || "-",
    },
    {
      title: t("adminAccounts.targetUsername"),
      dataIndex: "targetUsername",
      key: "targetUsername",
      align: "center",
      render: (value: string | null) => value || "-",
    },
    {
      // One transfer is several rows sharing a timestamp; this is the only
      // column that says which admin each of them demoted.
      title: t("adminAccounts.detail"),
      dataIndex: "detail",
      key: "detail",
      align: "center",
      render: (value: string | null) => value || "-",
    },
    {
      title: t("adminAccounts.ip"),
      dataIndex: "ip",
      key: "ip",
      align: "center",
      render: (value: string | null) => value || "-",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default AuditList;
