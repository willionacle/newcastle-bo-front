import i18next from "@/i18n/i18n";
import { Descriptions, DescriptionsProps } from "antd";
import { GF } from "@/utils/GlobalFunctions";
import { BetDetailsProp } from "@/pages/betting/record/List";
import CommaNumber from "@/components/CommaNumber";
import { AGBaccaratType } from "./Baccarat";

interface Props {
  data?: BetDetailsProp;
  gameData: AGBaccaratType;
}

const BaccaratDesc = ({data, gameData}: Props) => {
  
  const items: DescriptionsProps['items'] = [
    { key: 1, label: i18next.t("betting.gameId"), children: gameData?.transactionID},
    { key: 2, label: i18next.t("betting.provider"), children: data?.vendor?.toUpperCase()},
    { key: 3, label: i18next.t("betting.tableInfo"), children: data?.record?.game_name},
    // { key: 4, label: '유저 배팅', children: baccResKRText[formattedGameType] || formattedGameType},
    { key: 4, label: i18next.t("betting.userBet"), children: gameData?.playname.split("_")[1]},
    { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={data?.record?.bet_amount} />}, // bet amount
    { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={data?.record?.win_amount} />}, // win amount
    { key: 7, label: i18next.t("title.betTime"), children:  GF.cleanDateString(data?.record?.bet_date, true)}, //GF.convertToGMT(betData?.placedOn)
    { key: 8, label: i18next.t("betting.roundNumber"), children: ""},
  ]

  return <Descriptions size="small" layout="vertical" items={items} column={4} />
};

export default BaccaratDesc;
