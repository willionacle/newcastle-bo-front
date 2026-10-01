import { BalanceLogAPI } from "@/api/balance-logs/get";
import DateText from "@/components/DateText";
import CommaNumber from "@/components/CommaNumber";
import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { PaginationProps } from "antd/lib";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Link } from "react-router-dom";
import { GF } from "@/utils/GlobalFunctions";

interface Props {
  data: BalanceLogAPI[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, pagination, onHeaderCell }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<BalanceLogAPI>["columns"] = [
    {
      title: "No",
      align: "center",
      width: 60,
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: t("col.agent"),
      dataIndex: "agentUsername",
      key: "agentUsername",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.username"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.userId}`}>{value}</Link>
      ),
    },
    {
      title: t("col.name"),
      dataIndex: "userRealName",
      key: "userRealName",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.level"),
      dataIndex: "userLevel",
      key: "userLevel",
      align: "center",
      width: 70,
      render: (value) => value ?? "-",
    },
    {
      title: t("col.grade"),
      dataIndex: "userGrade",
      key: "userGrade",
      align: "center",
      width: 70,
      render: (value) => GF.handleGradeStrVal(value) ?? "-",
    },
    {
      title: t("col.changeAmount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("col.recordType"),
      dataIndex: "recordType",
      key: "recordType",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("col.previousBalance"),
      dataIndex: "prevBalance",
      key: "prevBalance",
      align: "center",
      render: (value: number | null) =>
        value !== null ? <CommaNumber value={value} /> : "-",
    },
    {
      title: t("col.newBalance"),
      dataIndex: "afterBalance",
      key: "afterBalance",
      align: "center",
      render: (value: number | null) =>
        value !== null ? <CommaNumber value={value} /> : "-",
    },
    {
      title: t("col.systemMemo"),
      dataIndex: "systemNote",
      key: "systemNote",
      align: "center",
      width: 200,
      render: (value) => value ?? "-",
    },
    // {
    //   title: t("게임 ID"),
    //   dataIndex: "gameId",
    //   key: "gameId",
    //   align: "center",
    //   render: (value) => value ?? "-",
    // },
    // {
    //   title: t("게임 카테고리"),
    //   dataIndex: "gameCategory",
    //   key: "gameCategory",
    //   align: "center",
    //   render: (value) => value ?? "-",
    // },
    {
      title: t("col.createdDateTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 150,
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    // {
    //   title: t("수정일시"),
    //   dataIndex: "updatedAt",
    //   key: "updatedAt",
    //   align: "center",
    //   width: 150,
    //   render: (value: string) => <DateText date={value} timeStamp />,
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
      tableLayout="auto"
      rowKey="id"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      style={{
        marginTop: "1rem",
      }}
      pagination={pagination}
    />
  );
};

export default List;
