import i18next from "@/i18n/i18n";
import { Descriptions, DescriptionsProps } from "antd";
import { GF } from "@/utils/GlobalFunctions";
import CommaNumber from "@/components/CommaNumber";
import { RawData } from "@/api/bet-details/get";
import { useMemo } from "react";
import { BetLogData } from "@/api/betting-logs/get";
import { EvoBetDetails } from "../evo/baccarat/Baccarat";

interface Props {
  newData?: RawData;
  record?: BetLogData
}

function sumAmounts(bets?: RawData["participants"][0]["bets"]) {
  let totalBetAmount = 0;
  let totalWinAmount = 0;

  if (bets) {
    bets.forEach((item) => {
      totalBetAmount += (item.stake || 0);
      totalWinAmount += (item.payout || 0);
    })
  }

  return {
    totalBetAmount,
    totalWinAmount
  }
}


const BetDesc = ({newData, record}: Props) => {

  const amounts = useMemo(() => sumAmounts(newData?.participants[0].bets), [newData]);
  const participant = newData?.participants[0];
  const recordBetData = GF.isValidJSON(record?.bet_data!) ? 
    (JSON.parse(record?.bet_data!) as EvoBetDetails) : 
    undefined;
  console.log(JSON.parse(record?.bet_data!))
  const items: DescriptionsProps['items'] = [
    { key: 1, label: i18next.t("betting.gameId"), children: participant?.playerGameId},
    { key: 2, label: i18next.t("betting.provider"), children: record?.game_history?.toUpperCase()},
    { key: 3, label: i18next.t("betting.tableInfo"), children: recordBetData?.gameData?.GameName || newData?.table?.name},
    { key: 4, label: i18next.t("betting.userBet"), children: "-"},
    { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={amounts.totalBetAmount} />}, // bet amount
    { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={amounts.totalWinAmount} />}, // win amount
    { key: 7, label: i18next.t("title.betTime"), children:  GF.cleanDateString(newData?.startedAt, true)}, //GF.convertToGMT(betData?.placedOn)
    { key: 8, label: i18next.t("betting.roundNumber"), children: recordBetData?.gameData?.RoundNo || "-"},
  ]

  return <Descriptions size="small" layout="vertical" items={items} column={4} />
};

export default BetDesc;
