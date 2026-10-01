import { ChatUser } from "@/api/stream-community/get";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  data: ChatUser[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
  chatUser: ChatUser;
}

const List = ({ data, loading, pagination, onHeaderCell,chatUser }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps["columns"] = [
    {
      title: "Match ID",
      dataIndex: "match_id",
      key: "match_id",
      align: "center",
      width:"100px",
    },
    {
      title: t("ID"),
      dataIndex: "username",
      key: "username",
      align: "center",
      width:"100px",
      render: (value, _record) => <Link to={`/user/${chatUser.user_id}`} children={value} />
    },    
    {
      title: t("memberInfo.mi006"),
      dataIndex: "real_name",
      key: "real_name",
      align: "center",
      render: (_value, _record) => chatUser.real_name ?? "-"
    },
    {
      title: t("col.content"),
      dataIndex: "comment",
      key: "comment",
      align: "center",
      render: (value) => value ? value : '-',
    },
    {
      title: t("col.dateTime"),
      dataIndex: "comment_date",
      key: "comment_date",
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
        rowKey={"id"}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
      />
    </div>
  );
};

export default List;
