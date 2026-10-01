import { AgentBalanceLog } from "@/api/agent/get";
import { BalanceLog } from "@/api/balance-logs/get";
import { ResPostList } from "@/api/types";
import ColorizeUsername from "@/components/ColorizeUsername";
import CommaNumber from "@/components/CommaNumber";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
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

  const columnsArray: TableProps<AgentBalanceLog>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
      // render: (_value, _record, index) => pagination.pageSize
    },
    {
      title: t("agent.al044"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("agent.al045"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
      render: (_value, record) => <ColorizeUsername username={record.username} returnRealName />
    },
    {
      title: t("col.balanceBefore"),
      dataIndex: "prev_balance",
      key: "prev_balance",
      align: "center",
      render: (value) => <CommaNumber value={value} />,
    },
    {
      title: t("memberDetail.mis041"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("col.balanceAfter"),
      dataIndex: "post_balance",
      key: "post_balance",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("col.category"),
      dataIndex: "record_type",
      key: "record_type",
      align: "center",
    },
    {
      title: t("col.requestDateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: BalanceLog["created_at"]) => (
        GF.cleanDateString(value, true)
        // <DateText date={value} timeStamp />
      ),
    },
    {
      title: t("col.processedBy"),
      dataIndex: "admin_id",
      key: "admin_id",
      align: "center",
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
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
