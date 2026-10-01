import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

type DataType = {
  date: any;
  username: any;
  agent_id: number;
  newMembers: string;
  numberOfDepositors: string;
  numberOfFirstDeposit: string;
  numberOfDisable: string;
  totalDeposits: string;
  totalWithdraw: string;
  profit: string;
  commissionAmount: string;
  total_deposit_sum: number;
  total_withdrawal_sum: number;
  total_bet_sum: number;
  total_win_sum: number;
  total_winloss_sum: number;
  total_bonus_sum: number;
  total_lossing_point_sum: number;
  total_new_user_count: number;
  total_betting_user_count: number;
};

interface Props {
  data?: DataType[];
  loading?: boolean;
  onHeaderCell: OnHeaderCellType;
}

const List = ({data, loading, onHeaderCell}: Props) => {
  const { t } = useTranslation();

  const newDataSource = data && data.length > 0 ? data.filter((item: DataType) => {
    if ((item.total_deposit_sum !== 0 && item.total_deposit_sum )||
      (item.total_withdrawal_sum !== 0 && item.total_withdrawal_sum) ||
      (item.total_bet_sum !== 0 && item.total_bet_sum) ||
      (item.total_win_sum !== 0 && item.total_win_sum)
    ) {
      return item
    }
  }) : [];

  const columnsArray: ColumnsType<DataType> = [
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => ((newDataSource?.length ?? 0) + 1) - (index + 1),
    },
    {
      title: t("agentStatistics.ads001"),
      dataIndex: "date",
      key: "date",
      render: (value) => <DateText date={value} />,
    },
    {
      title: t("agentStatistics.ads006"),
      dataIndex: "total_deposit_sum",
      render: (value) => <CommaNumber value={value} />,
    },
    {
      title: t("agentStatistics.ads007"),
      dataIndex: "total_withdrawal_sum",
      render: (value) => <CommaNumber value={value} />,
    },
    {
      title: t("agentStatistics.ads008"),
      key: "total_dw_sum",
      dataIndex: "total_dw_sum",
      render: (_value, record) => <CommaNumber value={(record.total_deposit_sum ?? 0) - (record.total_withdrawal_sum ?? 0)} />,
    },
    {
      title: t("agentStatistics.ads009"),
      key: "total_bet_sum",
      dataIndex: "total_bet_sum",
      render: (value) => <CommaNumber value={value} />,
    },
    {
      title: t("agentStatistics.ads010"),
      key: "total_win_sum",
      dataIndex: "total_win_sum",
      render: (value) => <CommaNumber value={value} />,
    },
    {
      title: t("agentStatistics.ads011"),
      key: "total_winloss_sum",
      dataIndex: "total_winloss_sum",
      render: (_value, record) => <CommaNumber value={(record.total_bet_sum ?? 0) - (record.total_win_sum ?? 0)} />,
    },
    {
      title: t("agentStatistics.ads012"),
      key: "total_rolling_point_sum",
      dataIndex: "total_rolling_point_sum",
      render: (value) => <CommaNumber value={value} />,
    },
    {
      title: t("agentStatistics.ads013"),
      dataIndex: "total_lossing_point_sum",
    },
    {
      title: t("agentStatistics.ads014"),
      dataIndex: "total_new_user_count",
    },
    {
      title: t("col.depositUser"),
      dataIndex: "total_deposit_user_count",
      key: "total_deposit_user_count",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("agentStatistics.ads015"),
      dataIndex: "total_betting_user_count",
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );
  return (
    <Table
      sticky  
      dataSource={newDataSource}
      columns={columns}
      loading={loading}
      rowKey={(record, index) => `${index}-${record.username}-${record.date}`} 
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={false}
    />
  );
};

export default List;
