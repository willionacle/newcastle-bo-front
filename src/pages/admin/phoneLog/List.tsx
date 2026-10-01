import { PhoneNumberLog } from "@/api/phone-number-log/get";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data?: any;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<PhoneNumberLog>["columns"] = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: t("phoneLog.pl002"),
      dataIndex: "queried_username",
      key: "queried_username",
      align: "center",
    },
    {
      title: t("phoneLog.pl004"),
      dataIndex: "queried_account_name",
      key: "queried_account_name",
      align: "center",
    },
    {
      title: t("phoneLog.pl005"),
      dataIndex: "queried_phone_number",
      key: "queried_phone_number",
      align: "center",
    },
    {
      title: t("phoneLog.pl003"),
      dataIndex: "requesting_username",
      key: "requesting_username",
      align: "center",
    },
    {
      title: t("phoneLog.pl007"),
      dataIndex: "requesting_account_name",
      key: "requesting_account_name",
      align: "center",
    },
    {
      title: t("phoneLog.pl008"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      loading={loading}
      rowKey={"id"}
      columns={columns}
      dataSource={data}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
