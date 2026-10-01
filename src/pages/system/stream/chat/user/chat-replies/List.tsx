import { ChatReply } from "@/api/stream-community/get";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: ChatReply[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
}

const List = ({ data, loading, pagination, onHeaderCell }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps["columns"] = [
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      align: "center",
      width:"100px",
    },    
    {
      title: t("memberInfo.mi006"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t("col.content"),
      dataIndex: "reply",
      key: "reply",
      align: "center",
      render: (value) => value ? value : '-',
    },
    {
      title: t("col.dateTime"),
      dataIndex: "reply_date",
      key: "reply_date",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp/>,
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <div>
      <Table
        sticky
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => `${record.id}-${record.reply_date}`}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
      />
    </div>
  );
};

export default List;
