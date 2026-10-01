import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { UserDailyStatsTotal } from "@/api/cs-statics/user-daily-stats";
import CommaNumber from "@/components/CommaNumber";

interface Props {
  total: UserDailyStatsTotal | undefined;
  loading: boolean;
}

const Total = ({ total, loading }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<UserDailyStatsTotal>["columns"] = [
    {
      title: t("col.balance"),
      dataIndex: "total_balance",
      key: "total_balance",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.depositAmount"),
      dataIndex: "total_deposit_sum",
      key: "total_deposit_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.depositCount"),
      dataIndex: "total_deposit_count",
      key: "total_deposit_count",
      align: "center",
      width: "5%",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.depositBonus"),
      dataIndex: "total_deposit_bonus_sum",
      key: "total_deposit_bonus_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.withdrawalAmount"),
      dataIndex: "total_withdrawal_sum",
      key: "total_withdrawal_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.netDeposit"),
      dataIndex: "total_dw_sum",
      key: "total_dw_sum",
      align: "center",
      render: (_, total) => (
        <CommaNumber
          value={
            (total?.total_deposit_sum ?? 0) - (total?.total_withdrawal_sum ?? 0)
          }
          onlyNumber
        />
      ),
    },
    {
      title: t("col.betAmount"),
      dataIndex: "total_bet_sum",
      key: "total_bet_sum",
      align: "center",
      width: "5%",
      render: (_, total) => (
        <CommaNumber
          value={(total?.total_bet_sum ?? 0) - (total?.total_cancel_sum ?? 0)}
          onlyNumber
        />
      ),
    },
    {
      title: t("col.winningAmount"),
      dataIndex: "total_win_sum",
      key: "total_win_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.betDifference"),
      dataIndex: "total_bw_sum",
      key: "total_bw_sum",
      align: "center",
      render: (_, total) => (
        <CommaNumber
          value={(total?.total_bet_sum ?? 0) - (total?.total_win_sum ?? 0)}
          onlyNumber
        />
      ),
    },
    {
      title: t("col.rollingPoint"),
      dataIndex: "total_rolling_point_sum",
      key: "total_rolling_point_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.totalBonus"),
      dataIndex: "total_bonus",
      key: "total_bonus",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
  ];

  return (
    <Table
      sticky 
      loading={loading}
      columns={columnsArray}
      dataSource={total ? [total] : undefined}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};

export default Total;
