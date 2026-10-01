import i18next from "@/i18n/i18n";
import { Descriptions, DescriptionsProps } from "antd";
import { GF } from "@/utils/GlobalFunctions";
import { BetDetailsProp } from "@/pages/betting/record/List";
import CommaNumber from "@/components/CommaNumber";
import { SAGAmingResponseData, SAGParsedBetData } from "@/api/bet-details/@types/sagaming";
import { outComeResultDetail } from "./Baccarat";

interface Props {
  data?: BetDetailsProp;
  betDetails?: SAGAmingResponseData;
  betData: SAGParsedBetData | null;
}

const BaccaratDesc = ({data, betDetails, betData}: Props) => {

  const items: DescriptionsProps['items'] = [
    { key: 1, label: i18next.t("betting.gameId"), children: data?.record?.req_id},
    { key: 2, label: i18next.t("betting.provider"), children: data?.vendor?.toUpperCase()},
    { key: 3, label: i18next.t("betting.tableInfo"), children: data?.record?.reserve_id},
    { key: 4, label: i18next.t("betting.userBet"), children: outComeResultDetail(betDetails?.data?.GetAllBetDetailsForTransactionIDResponse?.Result?.BaccaratResult?.ResultDetail)},
    { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={data?.record?.bet_amount} />}, // bet amount
    { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={data?.record?.win_amount} />}, // win amount
    { key: 7, label: i18next.t("title.betTime"), children:  GF.cleanDateString(data?.record?.bet_date, true)}, //GF.convertToGMT(betData?.placedOn)
    { key: 8, label: i18next.t("betting.roundNumber"), children: betData?.gameData?.RoundNo},
  ]

  return <Descriptions size="small" layout="vertical" items={items} column={4} />
};

export default BaccaratDesc;
