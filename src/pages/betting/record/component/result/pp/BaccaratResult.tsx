import i18next from "@/i18n/i18n";
import { Descriptions, DescriptionsProps } from "antd";
import { BetDetailsProp } from "../../../List";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";

interface Prop {
  data?: BetDetailsProp;
}

interface GameData {
  GameInfo: string;
  GameName: string;
  GameType: string;
  RoundNo: string;
  TransType: string;
}

interface BetData {
  betData: string;
  gameData: GameData;
}

const BaccaratResult = ({ data }: Prop) => {
  // console.log('Non Sport', data);

  const {gameData} = data?.bet_data as unknown as BetData;

  const items: DescriptionsProps['items'] = [
      { key: 1, label: i18next.t("betting.gameId"), children: gameData.RoundNo}, // Game ID
      { key: 2, label: i18next.t("betting.provider"), children: 'Pragmatic'}, // Provider
      { key: 3, label: i18next.t("betting.tableInfo"), children: gameData.GameType}, // Table Information
      // { key: 4, label: '유저 배팅', children: baccResKRText[formattedGameType] || formattedGameType}, // User Betting
      { key: 4, label: i18next.t("betting.userBet"), children: '-'}, // User Betting
      { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={data?.record?.bet_amount} />}, // Betting Amount
      { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={data?.record?.win_amount} /> }, // Winnings
      { key: 7, label: i18next.t("title.betTime"), children: <DateText date={data?.record?.bet_date ?? null} timeStamp />}, // Betting Time
    ]

  return <Descriptions size="small" layout="vertical" items={items} column={4} />
};

export default BaccaratResult;
