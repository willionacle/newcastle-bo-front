import i18next from "@/i18n/i18n";
import { Descriptions, DescriptionsProps } from "antd";
import { GF } from "@/utils/GlobalFunctions";
import { GameData } from "./Sicbo";
import { BetDetailsProp } from "@/pages/betting/record/List";
import CommaNumber from "@/components/CommaNumber";
import { NewEvoBetData } from "@/api/bet-details/get";
import { useMemo } from "react";

interface Props {
  data?: BetDetailsProp;
  gameData?: GameData;
  newData?: NewEvoBetData;
}

function sumAmounts(bets?: NewEvoBetData['results']['Bets']) {
  let totalBetAmount = 0;
  let totalWinAmount = 0;

  if (bets) {
    bets.forEach((item) => {
      totalBetAmount += (item.Stake || 0);
      totalWinAmount += (item.Payout || 0);
    })
  }

  return {
    totalBetAmount,
    totalWinAmount
  }
}


const SicboDesc = ({newData}: Props) => {

  const amounts = useMemo(() => sumAmounts(newData?.results.Bets), [newData]);

  const items: DescriptionsProps['items'] = [
    { key: 1, label: i18next.t("betting.gameId"), children: newData?.results?.GameId},
    { key: 2, label: i18next.t("betting.provider"), children: newData?.raw?.data?.gameProvider?.toUpperCase()},
    { key: 3, label: i18next.t("betting.tableInfo"), children: newData?.results?.TableName},
    { key: 4, label: i18next.t("betting.userBet"), children: newData?.results?.Outcome},
    { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={amounts.totalBetAmount} />}, // bet amount
    { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={amounts.totalWinAmount} />}, // win amount
    { key: 7, label: i18next.t("title.betTime"), children:  GF.cleanDateString(newData?.results?.StartedAt, true)}, //GF.convertToGMT(betData?.placedOn)
    { key: 8, label: i18next.t("betting.roundNumber"), children: newData?.results?.Uuid},
  ]

  return <Descriptions size="small" layout="vertical" items={items} column={4} />
};

export default SicboDesc;
