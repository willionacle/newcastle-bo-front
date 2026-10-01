import i18next from "@/i18n/i18n";
import { Descriptions, DescriptionsProps } from "antd";
import { GF } from "@/utils/GlobalFunctions";
import { EvoBetDetails, GameData, parseEvoBetData, TableData } from "./DragonTiger";
import { BetDetailsProp } from "@/pages/betting/record/List";
import CommaNumber from "@/components/CommaNumber";
import { NewEvoBetData } from "@/api/bet-details/get";

interface Props {
  betData: EvoBetDetails['betData'] | string;
  formattedGameType: string;
  data?: BetDetailsProp;
  gameData?: GameData;
  tableData?: TableData;
  newData?: NewEvoBetData;
}


const DragonTigerDesc = ({formattedGameType, data, gameData,betData, tableData, newData}: Props) => {
  console.log(gameData)
  const parsedBetData = parseEvoBetData(betData as string)

  const items: DescriptionsProps['items'] = [
    { key: 1, label: i18next.t("betting.gameId"), children: tableData?.id || newData?.results?.GameId},
    { key: 2, label: i18next.t("betting.provider"), children: newData?.raw?.data?.gameProvider?.toUpperCase() || data?.vendor?.toUpperCase()},
    { key: 3, label: i18next.t("betting.tableInfo"), children: newData?.results?.TableName || tableData?.name || parsedBetData[1]?.name},
    // { key: 4, label: '유저 배팅', children: baccResKRText[formattedGameType] || formattedGameType},
    { key: 4, label: i18next.t("betting.userBet"), children: newData?.results?.PlayerId || formattedGameType},
    { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={data?.record?.bet_amount} />}, // bet amount
    { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={data?.record?.win_amount} />}, // win amount
    { key: 7, label: i18next.t("title.betTime"), children:  GF.cleanDateString(newData?.results?.StartedAt, true)}, //GF.convertToGMT(betData?.placedOn)
    { key: 8, label: i18next.t("betting.roundNumber"), children: newData?.results?.Uuid},
  ]

  return <Descriptions size="small" layout="vertical" items={items} column={4} />
};

export default DragonTigerDesc;
