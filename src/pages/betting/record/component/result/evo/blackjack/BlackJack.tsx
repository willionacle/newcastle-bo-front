import { Flex, Space, Spin } from "antd";
import Panel from "@/components/Panel";
import BaccaratResults from "./BlackJackResults";
import BaccaratDesc from "./BlackJackDesc";
import { BetDetailsProp } from "@/pages/betting/record/List";
import BaccaratBets from "./BlackJackBets";
// import SicBoResults from "../sicbo/SicBoResults";
import { getBetDetails } from "@/api/bet-details/get";
interface Prop {
  data?: BetDetailsProp;
}

export interface BetData {
  "code": string;
  "stake": number;
  "payout": number;
  "placedOn": string;
  "transactionId": string;
  "id": string;
  "name": string;
}

export interface EvoGameInfoData {
  // "redEnvelopePayouts": [],
  // "sideBetPerfectPair": "Lose" | "Win" | "Tie",
  // "sideBetPlayerPair": "Lose" | "Win" | "Tie",
  // "sideBetPlayerBonus": "Lose" | "Win" | "Tie",
  // "sideBetBankerBonus": "Lose" | "Win" | "Tie",
  "banker": {
    "score": number;
    "cards": string[];
  },
  "outcome": "Player";
  // "sideBetEitherPair": "Lose" | "Win" | "Tie",
  // "sideBetBankerPair": "Lose" | "Win" | "Tie",
  "player": {
    "score": number;
    "cards": string[];
  }
}

export interface GameData {
  GameInfo: EvoGameInfoData;
  GameName: string;
  GameType: string;
  RoundNo: string;
  TransType: string;
  transaction_id?: string;
}

export interface TableData {
  id: string;
  name: string;
}

export interface EvoBetDetails {
  betData: BetData[]; 
  gameData: GameData; 
  tableData: TableData; 
}

const BlackJack = ({ data }: Prop) => {
  const {data: NewEvoBetData, isLoading} = getBetDetails({username: data?.record?.username!, gameid: data?.record?.req_id! })
  const evoData = data?.bet_data as unknown as EvoBetDetails;
  console.log('New Evo Data', NewEvoBetData);
  
  const { betData, gameData } = { 
    betData: evoData?.betData ? evoData?.betData : null,
    gameData: evoData?.gameData,
    tableData: evoData?.tableData
  } as EvoBetDetails;

  
  console.log('Evo betData', betData);
  console.log('Evo Results', NewEvoBetData?.data?.data?.results);

  if (isLoading) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }

  return (
    <Space direction="vertical">
      <BaccaratDesc 
        data={data} 
        newData={NewEvoBetData?.data?.data} 
        gameData={gameData}
      />
      <Panel>
        <BaccaratResults 
          data={NewEvoBetData?.data?.data?.raw?.data} 
        />
      </Panel>
      <BaccaratBets 
        data={NewEvoBetData?.data?.data?.raw?.data?.participants[0].bets || []} 
      /> 
    </Space>
  );
};

export default BlackJack;
