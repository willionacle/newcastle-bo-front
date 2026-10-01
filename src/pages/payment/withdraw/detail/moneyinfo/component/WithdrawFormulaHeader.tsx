import i18next from "@/i18n/i18n";
import { WithdrawalBetSummaryData } from "@/api/withdrawal-detail/post";
import CommaNumber from "@/components/CommaNumber";
import { Flex } from "antd";

interface Props {
  betSummaryData: WithdrawalBetSummaryData | undefined;
}

const WithdrawalFormulaHeader = ({ betSummaryData }: Props) => {
  const part1 =
    (betSummaryData?.prevBalance || 0) +
    (betSummaryData?.lastDepositAmount || 0) +
    (betSummaryData?.lastBonusAmount || 0) +
    (betSummaryData?.pointConversionTotal || 0);
  const part2 = betSummaryData?.netLossAdjusted || 0;
  const part3 = betSummaryData?.sportsPendingBetAmount || 0;
  const part4 = betSummaryData?.withdrawAmount || 0;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "start",
        alignItems: "end",
        gap: "12px",
        fontSize: "20px",
        width:"100%",
        marginTop:"auto",
        paddingTop:"24px"
      }}
    >
      {/* Part 1: Principal */}
      <Flex gap={5}>원금 {part1 ? <CommaNumber value={part1} /> : 0}</Flex>

      <span>+</span>

      {/* Part 2: Net Winnings */}
      <Flex gap={5}>{i18next.t("col.betProfitLoss")} {part2 ? <CommaNumber value={part2} /> : 0}</Flex>

      <span>-</span>

      {/* Part 3: Pending Bets */}
      <Flex gap={5}>대기중인베팅 {part3 ? <CommaNumber value={part3} /> : 0}</Flex>

      <span>=</span>

      {/* Part 4: Result */}
      <Flex gap={5} style={{ borderBottom: "1px solid black" }}>
        {i18next.t("payment.withdrawableAmount")} {part4 ? <CommaNumber value={part4} /> : 0}
      </Flex>
    </div>
  );
};

export default WithdrawalFormulaHeader;
