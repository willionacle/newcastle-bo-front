import { PaybackLogData } from "@/api/payback-logs/get";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: PaybackLogData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, pagination }: Props) => {
  const { t } = useTranslation();

  const columns: TableProps<PaybackLogData>["columns"] = [
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
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("col.depositAmount"),
      dataIndex: "deposit_sum",
      key: "deposit_sum",
      align: "center",
      render: (value: number) => value ? value.toLocaleString() : "-",
    },
    {
      title: t("col.withdrawalAmount"),
      dataIndex: "withdrawal_sum",
      key: "withdrawal_sum",
      align: "center",
      render: (value: number) => value ? value.toLocaleString() : "-",
    },
    {
      title: t("col.netDeposit"),
      dataIndex: "total_rolling",
      key: "total_rolling",
      align: "center",
      render: (_, record) =>
        ((record.deposit_sum ?? 0) - (record.withdrawal_sum ?? 0)).toLocaleString(),
    },
    {
      title: t("col.sundayBalance"),
      dataIndex: "sunday_balance",
      key: "sunday_balance",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.paybackPercent"),
      dataIndex: "lossing_percentage",
      key: "lossing_percentage",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.maxPayout"),
      dataIndex: "max_amount",
      key: "max_amount",
      align: "center",
      render: (value: number) => value ? value.toLocaleString() : "-",
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
      render: (_, record) =>
        ((record.prevlossing_point ?? 0) + record.amount).toLocaleString(),
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
