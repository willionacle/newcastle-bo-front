import { SmsLogData } from "@/api/sms-log/get";
import { ResPostList } from "@/api/types";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<SmsLogData>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   align: "center",
    //   render: (value: number) => value.toLocaleString(),
    // },
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("phone number"),
      dataIndex: "phone_number",
      align: "center",
    },
    {
      title: t("status"),
      dataIndex: "status",
      align: "center",
    },
    {
      title: t("userRealName"),
      dataIndex: "user_real_name",
      align: "center",
      render: (_, record) => <ColorizeUsername username={record.username ?? ""} returnRealName />
    },
    {
      title: t("userName"),
      dataIndex: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("verificationCode"),
      dataIndex: "verification_code",
      align: "center",
    },
    {
      title: t("msg"),
      dataIndex: "message",
      align: "center",
    },
    {
      title: t("created at"),
      dataIndex: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("updated at"),
      dataIndex: "updated_at",
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
