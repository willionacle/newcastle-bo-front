import { ResPostList } from "@/api/types";
import i18next from "@/i18n/i18n";
import ColorizeUsername from "@/components/ColorizeUsername";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { Link } from "react-router-dom";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const columnsArray: TableProps["columns"] = [
    {
      title: i18next.t("col.id"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.user_id}`}><ColorizeUsername username={value} /></Link>
      ),
    },
    {
      title: i18next.t("col.name"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
      render: (_, record) => <ColorizeUsername username={record.username} returnRealName />
    },
    {
      title: i18next.t("depositBonus.db010"),
      dataIndex: "bonus_group",
      key: "bonus_group",
      align: "center",
    },
    {
      title: i18next.t("depositBonus.db002"),
      dataIndex: "bonus_name",
      key: "bonus_name",
      align: "center",
    },
    {
      title: i18next.t("col.depositAmount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: i18next.t("col.bonusAmount"),
      dataIndex: "bonus_amount",
      key: "bonus_amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: i18next.t("col.payoutDateTime"),
      dataIndex: "payment_date",
      key: "payment_date",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      dataSource={data?.data}
      columns={columns}
      loading={loading}
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
