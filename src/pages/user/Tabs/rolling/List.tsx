import i18next from "@/i18n/i18n";
import { RollingLog } from "@/api/rolling-points/get";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: RollingLog[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();
  const columnsArray: TableProps<RollingLog>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      width:100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("memberDetail.mis028"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("maintenance.mt001"),
      dataIndex: "vendor_key",
      key: "vendor_key",
      align: "center",
    },
    {
      title: t("col.betAmount"),
      dataIndex: "bet_amount",
      key: "bet_amount",
      align: "center",

      render: (value: number) => (value ? value.toLocaleString() : undefined),
    },
    {
      title: t("col.rollingAppliedPercent"),
      dataIndex: "rolling_percentage",
      key: "rolling_percentage",
      align: "center",
      render: (value) => (value ? (value * 100).toFixed(2) : "-"),
    },
    {
      title: t("col.rollingDeductionWeight"),
      dataIndex: "rolling_percentage2",
      key: "rolling_percentage2",
      align: "center",
      width: 0,
      render: (value) => (value ? (value * 100).toFixed(2) : "-"),
    },
    {
      title: t("col.changeAmount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",

      render: (value) => (value ?? 0).toLocaleString(),
    },
    {
      title: t("col.balanceAfterChange"),
      align: "center",

      render: (_, record) =>
        ((record.prev_rolling_point ?? 0) + record.amount).toLocaleString(),
    },
    {
      title: t("col.category"),
      dataIndex: "record_type",
      align: "center",
      render: (value) => (value == "베팅" ? i18next.t("user.cumulativeBet") : value),
    },
    {
      title: t("col.systemNote"),
      dataIndex: "system_note",
      key: "system_note",
      align: "center",
      onCell: () => ({
        style: {
          width: 300,
        },
      }),
    },
    {
      title: t("col.dateTime"),
      dataIndex: "created_at",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
    // {
    //   title: t("col.adminId"),
    //   dataIndex: "admin_id",
    //   align: "center",
    //   width: 120,
    // },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      dataSource={data}
      loading={loading}
      columns={columns}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
