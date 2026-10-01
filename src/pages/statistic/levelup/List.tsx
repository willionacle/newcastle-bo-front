import ColorizeUsername from "@/components/ColorizeUsername";
import i18next from "@/i18n/i18n";
import DateText from "@/components/DateText";
import { Table, TableProps } from "antd";

const List = ({ data, loading, onHeaderCell, pagination }: any) => {
  const columnsArray: TableProps<any>["columns"] = [
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => ((data?.length ?? 0) + 1) - (index + 1),
    },
    { 
      title: "ID", 
      dataIndex: "username", 
      key: "username", 
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    { 
      title: i18next.t("title.previousLevelTitle"), 
      dataIndex: "current_level", 
      key: "current_level", 
      align: "center" 
    },
    { 
      title: i18next.t("title.nextLevel"), 
      dataIndex: "next_level", 
      key: "next_level", 
      align: "center" 
    },
    {
      title: i18next.t("col.createdDate"),
      dataIndex: "attempt_date",
      key: "attempt_date",
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
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={"log_id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
