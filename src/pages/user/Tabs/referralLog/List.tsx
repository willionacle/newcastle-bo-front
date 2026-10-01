import { ReferralLogData } from "@/api/referral-logs/get";
import DateText from "@/components/DateText";
import NewColorizeUsername from "@/components/NewColorizeUsername";
import { OnHeaderCellType } from "@/hooks/useSort";
import { PaginationProps, Table } from "antd";
import { TableProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: ReferralLogData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, pagination }: Props) => {
  const { t } = useTranslation();

  const columns: TableProps<ReferralLogData>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: t("col.userId"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <NewColorizeUsername value={value} />
    },
    {
      title: t("col.totalReferrals"),
      dataIndex: "total_referral_count",
      key: "total_referral_count",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.bettingReferrals"),
      dataIndex: "active_referral_count",
      key: "active_referral_count",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.totalRolling"),
      dataIndex: "total_rolling",
      key: "total_rolling",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.appliedPercent"),
      dataIndex: "rolling_percentage",
      key: "rolling_percentage",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.maxPayout"),
      dataIndex: "max_amount",
      key: "max_amount",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.amount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("col.total"),
      key: "total",
      align: "center",
      render: (_, record) => record.prev_referral_point ?? 0 + record.amount,
    },
    {
      title: t("col.category"),
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: t("col.systemNote"),
      dataIndex: "system_note",
      key: "system_note",
      align: "center",
    },
    {
      title: t("col.dateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.adminId"),
      dataIndex: "admin_id",
      key: "admin_id",
      align: "center",
      render: (value) => value ?? "-",
    },
  ];

  return (
    <Table
      sticky 
      columns={columns}
      dataSource={data}
      tableLayout="auto"
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      loading={loading}
      pagination={pagination}
    />
  );
};

export default List;
