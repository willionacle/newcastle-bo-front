import { WidthdrawalDetailBalanceData } from "@/api/withdrawal-detail/post";
import i18next from "@/i18n/i18n";
import DateText from "@/components/DateText";
import NewColorizeUsername from "@/components/NewColorizeUsername";
import { PaginationProps, Table, TableProps } from "antd";

interface Props {
  data: WidthdrawalDetailBalanceData["balanceLogs"] | undefined;
  isLoading: boolean;
  pagination: PaginationProps;
}

const MoneyTable = ({ data, isLoading, pagination }: Props) => {
  const columns: TableProps["columns"] = [
    {
      title: "#",
      dataIndex: "id",
      align: "center",
    },
    {
      title: i18next.t("col.userId"),
      dataIndex: "username",
      align: "center",
      render: (value, record) => <NewColorizeUsername value={value} dateRegistered={record.user_regdate} userStatus={record.user_status} />
    },
    {
      title: i18next.t("col.amount"),
      dataIndex: "amount",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: i18next.t("col.total"),
      align: "center",
      render: (_, record) =>
        (record.prevBalance + record.amount).toLocaleString(),
    },
    {
      title: i18next.t("col.category"),
      dataIndex: "type2",
      align: "center",
    },
    {
      title: i18next.t("memberDetail.mis042"),
      dataIndex: "systemNote",
      align: "center",
    },
    {
      title: i18next.t("title.requiredRolling"),
      dataIndex: "requiredRollingPercentage",
      align: "center",
    },
    {
      title: i18next.t("col.dateTime"),
      dataIndex: "createdAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: i18next.t("col.adminId"),
      dataIndex: "adminId",
      align: "center",
    },
  ];

  return (
    <Table
      sticky 
      columns={columns}
      dataSource={data}
      pagination={pagination}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      loading={isLoading}
    />
  );
};

export default MoneyTable;
