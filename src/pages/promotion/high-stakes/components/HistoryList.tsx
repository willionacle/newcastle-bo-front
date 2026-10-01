import i18next from "@/i18n/i18n";
import ColorizeUsername from "@/components/ColorizeUsername";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { HighStakesHistoryRow } from "@/api/high-stakes/get-history";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";

interface Props {
  data: HighStakesHistoryRow[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const HistoryList = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const columnsArray: TableProps<HighStakesHistoryRow>["columns"] = [
    {
      title: i18next.t("col.id"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value: string) => <ColorizeUsername username={value} />,
    },
    {
      title: i18next.t("highStakes.categoryColumn"),
      dataIndex: "label_ko",
      key: "game_category",
      align: "center",
    },
    {
      title: i18next.t("highStakes.amountColumn"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: i18next.t("highStakes.thresholdColumn"),
      dataIndex: "threshold",
      key: "threshold",
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

export default HistoryList;
