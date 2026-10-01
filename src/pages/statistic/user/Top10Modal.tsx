import { Modal, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { UserDailyStatsData, useTop10Users } from "@/api/cs-statics/user-daily-stats";
import CommaNumber from "@/components/CommaNumber";
import Percentage from "@/components/Percentage";
import { GF } from "@/utils/GlobalFunctions";

interface Props {
  open: boolean;
  onClose: () => void;
  startDate?: string | null;
  endDate?: string | null;
}

// Same formulas as the page's 전체 columns so the modal reconciles with the list:
// 입금액 includes USDT deposits; 입출차액 is the raw dw_sum.
const depositAmount = (r: UserDailyStatsData) => (r.deposit_sum ?? 0) + (r.u_deposit_sum ?? 0);
const dwAmount = (r: UserDailyStatsData) => r.dw_sum ?? 0;

/** TOP10 depositors for the page's selected period, across all game categories. */
const Top10Modal = ({ open, onClose, startDate, endDate }: Props) => {
  const { t } = useTranslation();
  const { swr } = useTop10Users({ startDate, endDate, open });

  const columns: TableProps<UserDailyStatsData>["columns"] = [
    {
      title: "No",
      key: "no",
      align: "center",
      width: 50,
      render: (_v, _r, index) => index + 1,
    },
    {
      title: t("col.name"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
    },
    {
      title: t("col.grade"),
      dataIndex: "user_grade",
      key: "user_grade",
      align: "center",
      render: (value: number) => GF.handleGradeStrVal(value),
    },
    {
      title: t("col.depositAmount"),
      key: "deposit",
      align: "center",
      render: (_value, record) => <CommaNumber value={depositAmount(record)} onlyNumber />,
    },
    {
      title: t("col.netDeposit"),
      key: "dw_sum",
      align: "center",
      render: (_value, record) => <CommaNumber value={dwAmount(record)} onlyNumber />,
    },
    {
      title: t("col.betAmount"),
      dataIndex: "bet_sum",
      key: "bet_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("userStats.inOutPayback"),
      key: "dw_return",
      align: "center",
      render: (_value, record) => {
        const base = depositAmount(record);
        return <Percentage value={base ? (dwAmount(record) / base) * 100 : undefined} />;
      },
    },
    {
      title: t("userStats.betPayback", "베팅환수"),
      key: "bw_return",
      align: "center",
      render: (_value, record) => {
        const bet = record.bet_sum ?? 0;
        return <Percentage value={bet ? ((record.bw_sum ?? 0) / bet) * 100 : undefined} />;
      },
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={t("userStats.top10Data", "TOP10 데이터")}
      width={900}
    >
      <Table
        rowKey={(record) => record.username ?? String(record.user_id)}
        columns={columns}
        dataSource={swr.data?.data ?? []}
        loading={swr.isLoading}
        size="small"
        pagination={false}
        scroll={{ x: true }}
      />
    </Modal>
  );
};

export default Top10Modal;
