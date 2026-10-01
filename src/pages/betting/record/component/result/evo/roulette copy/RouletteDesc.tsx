import i18next from "@/i18n/i18n";
import { Descriptions, DescriptionsProps } from "antd";
import { GF } from "@/utils/GlobalFunctions";
import { EvoBetDetails } from "./Roulette";
import { BetDetailsProp } from "@/pages/betting/record/List";
import CommaNumber from "@/components/CommaNumber";

interface Props {
  betData: EvoBetDetails['betData'];
  formattedGameType: string;
  data?: BetDetailsProp;
}


const RouletteDesc = ({betData, formattedGameType}: Props) => {
  

  const items: DescriptionsProps['items'] = [
    { key: 1, label: i18next.t("betting.gameId"), children: betData.transactionId}, // Game ID
    { key: 2, label: i18next.t("betting.provider"), children: "Evolution"}, // Provider
    { key: 3, label: i18next.t("betting.tableInfo"), children: betData.name}, // Table Information
    { key: 4, label: i18next.t("betting.userBet"), children: formattedGameType},// User Betting
    { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={betData.stake} />}, // Betting Amount
    { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={betData.payout} />}, // Winnings
    { key: 7, label: i18next.t("title.betTime"), children: GF.convertToGMT(betData.placedOn)}, // Betting Time
  ]

  return <Descriptions size="small" layout="vertical" items={items} column={4} />
};

export default RouletteDesc;
