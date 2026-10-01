import { Flex, Space, Spin } from "antd";
import Panel from "@/components/Panel";
import { baccResKRText, BetDetailsProp } from "@/pages/betting/record/List";
// import SicBoResults from "../sicbo/SicBoResults";
import { getBetDetails } from "@/api/bet-details/get";
import BacboBets from "./BacboBets";
import BacboResults from "./BacboResults";
import BacboDesc from "./BacboDesc";
import ResultHtml from "../html/ResultHtml";
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

export const parseBetData = (data: BetData[]): BetData => 
  Object.assign({}, ...data);

export const gameTypeFormatter = (type: string, matcher: string = "baccarat-BAC_") => {
  try {
    return type.replace(matcher, "");
  } catch (error) {
    return type;
  }
}

export function parseEvoBetData(betData: string | BetData[]): any[] {
  if (!betData) return [];

  try {
    const fixed = "[" + String(betData).replace(/}\s*{/g, "},{") + "]";
    return JSON.parse(fixed);
  } catch (err) {
    console.error("Invalid betData JSON:", err);
    return [];
  }
}

const Bacbo = ({ data }: Prop) => {
  const {data: NewEvoBetData, isLoading} = getBetDetails({username: data?.record?.username!, gameid: data?.record?.req_id! })
  const evoData = data?.bet_data as unknown as EvoBetDetails;
  console.log('New Evo Data', NewEvoBetData);
  console.log('Evo', evoData);
  console.log('Evo bet data', evoData.betData);
  
  const { betData, gameData, tableData } = { 
    betData: evoData?.betData ? evoData?.betData : null,
    gameData: evoData?.gameData,
    tableData: evoData?.tableData
  } as EvoBetDetails;

  const { GameName, GameType } = gameData;
  // const formattedGameType = gameTypeFormatter(GameName ?? GameType);
  const formattedGameType = baccResKRText[gameTypeFormatter(GameType ?? GameName)] || gameTypeFormatter(GameType ?? GameName) || GameType || GameName;
  const GameInfo = null;
  
  // try {
  //   GameInfo = gameData.GameInfo ? JSON.parse(gameData.GameInfo as unknown as string) : null;
  // } catch (error) {
  //   console.error(error)
  //   GameInfo = gameData.GameInfo;
  //   return (
  //     <Space direction="vertical">
  //       <BaccaratDesc tableData={tableData} betData={betData} formattedGameType={formattedGameType} data={data} gameData={gameData} />
  //     </Space>
  //   );
  // }
  console.log('Evo betData', betData);
  console.log('Evo GameInfo', GameInfo);
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
      <BacboDesc 
        tableData={tableData} 
        betData={betData} 
        formattedGameType={formattedGameType} 
        data={data} 
        newData={NewEvoBetData?.data?.data} 
        gameData={gameData}
      />
      <Panel>
        {(NewEvoBetData?.data.url && NewEvoBetData?.data.url !== "[object Object]") ? (
          <ResultHtml 
            url={NewEvoBetData?.data?.url!} 
          />
        ): (
          <BacboResults 
            // data={GameInfo} 
            data={NewEvoBetData?.data?.data?.raw?.data?.result} 
          />
        )}
        
      </Panel>
      <BacboBets 
        // data={parseEvoBetData(betData)} 
        data={NewEvoBetData?.data?.data?.raw?.data?.participants[0].bets || []} 
      /> 
    </Space>
  );
};

export default Bacbo;
