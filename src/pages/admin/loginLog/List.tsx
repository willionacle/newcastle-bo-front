import { LoginRecords } from "@/api/login-records/get";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: LoginRecords[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<LoginRecords>["columns"] = [
    // {
    //   title: "#",
    //   dataIndex: "id",
    //   align: "center",
    // },
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("adminLog.adl006"),
      dataIndex: "user",
      align: "center",
      render: (value: string) => value ?? "-",
    },
    {
      title: t("adminLog.adl007"),
      dataIndex: "ip",
      align: "center",
    },
    {
      title: t("adminLog.adl008"),
      dataIndex: "login_date_time",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("adminLog.adl010"),
      dataIndex: "status",
      align: "center",
      render: (value: boolean) =>
        value ? t("global.true") : t("global.false"),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      dataSource={data}
      rowKey={"id"}
      loading={loading}
      columns={columns}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
