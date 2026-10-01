import i18next from "@/i18n/i18n";
import ColorizeUsername from "@/components/ColorizeUsername";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { AttendanceLogRow } from "@/api/attendance-logs/get";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";

interface Props {
  data: AttendanceLogRow[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const columnsArray: TableProps<AttendanceLogRow>["columns"] = [
    {
      title: i18next.t("col.id"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value: string) => <ColorizeUsername username={value} />,
    },
    {
      title: i18next.t("attendance.attendDateLabel"),
      dataIndex: "attend_date",
      key: "attend_date",
      align: "center",
    },
    {
      title: i18next.t("attendance.dayNumberLabel"),
      dataIndex: "day_number",
      key: "day_number",
      align: "center",
    },
    {
      title: i18next.t("attendance.amountColumn"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: i18next.t("attendance.rolloverRequiredLabel"),
      dataIndex: "rollover_required",
      key: "rollover_required",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: i18next.t("col.createdDateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
  ];

  const columns = columnsArray.map((item) => (item.key ? { ...item, onHeaderCell } : item));

  return (
    <Table
      sticky
      dataSource={data}
      columns={columns}
      loading={loading}
      rowKey="id"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
