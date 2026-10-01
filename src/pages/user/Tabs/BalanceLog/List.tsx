import { BalanceLog } from "@/api/balance-logs/get";
import { ResPostList } from "@/api/types";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: ResPostList['data'] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, pagination, onHeaderCell }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<BalanceLog>["columns"] = [
    {
      title: t("memberDetail.mis028"),
      dataIndex: "username",
      key: "username",
      align: "center",
      width: 120,
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("memberDetail.mis029"),
      dataIndex: "admin_id",
      key: "admin_id",
      align: "center",
      width: 120,
    },
    {
      title: t("memberDetail.mis040"),
      dataIndex: "type",
      key: "type",
      align: "center",
      width: 180,
      render: (value: BalanceLog["type"]) =>
        value === "MANUAL_ADJUSTMENT"
          ? t("memberDetail.mis081")
          : t("memberDetail.mis082"),
    },
    {
      title: t("memberDetail.mis041"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 250,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("memberDetail.mis042"),
      dataIndex: "system_note",
      key: "system_note",
      align: "center",
      width: 500,
    },
    {
      title: t("col.requestDateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: 200,
      render: (value: BalanceLog["created_at"]) => (
        <DateText date={value} timeStamp />
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      dataSource={data}
      columns={columns}
      loading={loading}
      rowKey={"id"}
      tableLayout="fixed"
      scroll={{ x: "100%" }}
      pagination={pagination}
    />
  );
};

export default List;
