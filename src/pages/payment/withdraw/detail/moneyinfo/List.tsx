import i18next from "@/i18n/i18n";
import { WithdrawalBetSummaryData } from "@/api/withdrawal-detail/post";
import CommaNumber from "@/components/CommaNumber";
import CommaNumberSpan from "@/components/CommaNumberSpan";
import PercentageSpan from "@/components/PercentageSpan";
import { Table, TableProps } from "antd";

interface Props {
  betSummaryData: WithdrawalBetSummaryData | undefined;
  loading: boolean;
}

const List = ({ betSummaryData, loading }: Props) => {

  const CenterTitle = (text: string) => (
    <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );

  const columnsArray: TableProps<WithdrawalBetSummaryData>["columns"] = [
    {
      title: CenterTitle(i18next.t("payment.balanceBeforeLastDeposit")),
      dataIndex: "prevBalance",
      align: "center",
      render: () => <div style={{ textAlign: 'center', minWidth: 30 }}><CommaNumber value={betSummaryData?.prevBalance || 0} /></div>,
    },
    {
      title: CenterTitle(i18next.t("payment.lastDepositAmount")),
      dataIndex: "lastDepositAmount",
      align: "center",
      render: () => <div style={{ textAlign: 'center', minWidth: 30 }}><CommaNumber value={betSummaryData?.lastDepositAmount || 0} /></div>,
    },
    {
      title: CenterTitle(i18next.t("payment.bonusAmount")),
      dataIndex: "lastBonusAmount",
      align: "center",
      render: () => <div style={{ textAlign: 'center', minWidth: 30 }}><CommaNumber value={betSummaryData?.lastBonusAmount || 0} /></div>,
    },
    {
      title: CenterTitle(i18next.t("deposit.de014")),
      dataIndex: "lastDepositName",
      align: "center",
      render: () => <div style={{textAlign: "center"}}><span>{betSummaryData?.lastDepositName || '-'}</span>(<PercentageSpan value={betSummaryData?.bonusPercentage || 0} onlyNumber />)</div>,
    },
    {
      title: CenterTitle(i18next.t("payment.pointConversion")),
      dataIndex: "pointConversion",
      align: "center",
      render: () => (
        <div style={{ textAlign: 'center', padding: '4px' }}>
          <div>{i18next.t("payment.referralLabel")} <CommaNumberSpan value={betSummaryData?.referralPointUsed || 0} /></div>
          <div>{i18next.t("payment.rollingLabel")} <CommaNumberSpan value={betSummaryData?.rollingPointUsed || 0} /></div>
          <div>{i18next.t("payment.couponLabel")} <CommaNumberSpan value={betSummaryData?.couponUsed || 0} /></div>
          <div style={{ borderTop: '1px solid #ddd', marginTop: '4px', paddingTop: '4px' }}>
            총합: <CommaNumberSpan value={betSummaryData?.pointConversionTotal || 0} />
          </div>
        </div>
      ),
    },
        {
      title: CenterTitle(i18next.t("payment.rollingPct")),
      dataIndex: "rolling",
      align: "center",
      render: () => {
        const depositAmount = betSummaryData?.lastDepositAmount || 0;
        
        const liveAmount = betSummaryData?.liveCurrentBetAmount || 0;
        const livePercentage = depositAmount > 0 ? (liveAmount / depositAmount) * 100 : 0;
        
        const slotAmount = betSummaryData?.slotCurrentBetAmount || 0;
        const slotPercentage = depositAmount > 0 ? (slotAmount / depositAmount) * 100 : 0;
        
        const sportsAmount = betSummaryData?.sportsTotalBetAmount || 0;
        const sportsPercentage = depositAmount > 0 ? (sportsAmount / depositAmount) * 100 : 0;
        
        const minigameAmount = betSummaryData?.minigameCurrentBetAmount || 0;
        const minigamePercentage = depositAmount > 0 ? (minigameAmount / depositAmount) * 100 : 0;
        
        return (
          <div style={{ textAlign: 'center', padding: '4px' }}>
            <div>
              {i18next.t("user.liveLabel")} <CommaNumberSpan value={liveAmount} /> (<PercentageSpan value={livePercentage} onlyNumber />)
            </div>
            <div>
              {i18next.t("user.slotLabel")} <CommaNumberSpan value={slotAmount} /> (<PercentageSpan value={slotPercentage} onlyNumber />)
            </div>
            <div>
              {i18next.t("user.sportsLabel")} <CommaNumberSpan value={sportsAmount} /> (<PercentageSpan value={sportsPercentage} onlyNumber />)
            </div>
            <div>
              {i18next.t("user.minigameLabel")} <CommaNumberSpan value={minigameAmount} /> (<PercentageSpan value={minigamePercentage} onlyNumber />)
            </div>
          </div>
        );
      },
    },
    {
      title: CenterTitle(i18next.t("payment.winMinusBet")),
      dataIndex: "netLossAdjusted",
      align: "center",
      render: () => <div style={{ textAlign: 'center', minWidth: 30 }}><CommaNumber value={betSummaryData?.netLossAdjusted || 0} /></div>,
    },
    {
      title: CenterTitle(i18next.t("col.sportsPending")),
      dataIndex: "sportsPendingBetAmount",
      align: "center",
      render: () => <div style={{ textAlign: 'center', minWidth: 30 }}><CommaNumber value={betSummaryData?.sportsPendingBetAmount || 0} /></div>,
    },
    {
      title: CenterTitle(i18next.t("payment.withdrawableAmount")),
      dataIndex: "withdrawAmount",
      align: "center",
      render: () => (
        <div style={{ textAlign: 'center', padding: '4px' }}>
          <div>{i18next.t("payment.calcLabel")} <CommaNumberSpan value={betSummaryData?.withdrawAmount || 0} /></div>
          <div>{i18next.t("payment.actualLabel")} <CommaNumberSpan value={betSummaryData?.actualWithdrawAmount || 0} /></div>
          <div style={{ 
            color: betSummaryData?.withdrawError && betSummaryData.withdrawError !== 0 ? '#ff4d4f' : '#52c41a',
            fontWeight: 'bold' 
          }}>
            오차: <CommaNumberSpan value={betSummaryData?.withdrawError || 0} />
          </div>
        </div>
      ),
    },
    {
      title: CenterTitle(i18next.t("payment.withdrawRequestAmount")),
      dataIndex: "withdrawRequest",
      align: "center",
      render: () => <div style={{ textAlign: 'center', minWidth: 30 }}><CommaNumber value={betSummaryData?.withdrawRequest || 0} /></div>,
    },
    {
      title: CenterTitle(i18next.t("payment.currentBalance")),
      dataIndex: "currentHolding",
      align: "center",
      render: () => <div style={{ textAlign: 'center', minWidth: 30 }}><CommaNumber value={betSummaryData?.currentHolding || 0} /></div>,
    },
  ];

  return (
    <Table
      sticky 
      dataSource={betSummaryData ? [betSummaryData] : []}
      columns={columnsArray}
      loading={loading}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      // pagination={false}
    />
  );
};

export default List;
