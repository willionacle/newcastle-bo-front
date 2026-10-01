import { Space } from "antd";
import Panel from "@/components/Panel";
import { baccResKRText, BetDetailsProp } from "@/pages/betting/record/List";
import RouletteDesc from "./RouletteDesc";
import RouletteResults from "./RouletteResults";
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

export interface Outcome {
  "number": string;
  "type": string;
  "color": string;
}

export interface EvoRoulGameInfoData {
  "outcomes": Outcome[],
  "luckyNumbers": Record<string, number>;
}

interface GameData {
  GameInfo: EvoRoulGameInfoData;
  GameName: string;
  GameType: string;
  RoundNo: string;
  TransType: string;
}

export interface EvoBetDetails {
  betData: BetData; 
  gameData: GameData; 
}

export const parseBetData = (data: BetData[]): BetData => 
  Object.assign({}, ...data);

export const gameTypeFormatter = (type: string, matcher: string = "roulette-ROU_") => 
  type.replace(matcher, "");

const Roulette = ({ data }: Prop) => {
  
  const evoData = data?.bet_data as unknown as EvoBetDetails;
  console.log('Evo', evoData);

  
  const { betData, gameData } = { 
    betData: evoData.betData ? parseBetData(JSON.parse(`[${evoData.betData}]` as unknown as string)) : null,
    gameData: evoData.gameData
  } as EvoBetDetails;
  
  const GameInfo: EvoRoulGameInfoData = gameData.GameInfo ? JSON.parse(gameData.GameInfo as unknown as string) : null;
  const { GameName, GameType } = gameData;
  // const formattedGameType = gameTypeFormatter(GameName ?? GameType);
  const formattedGameType = baccResKRText[gameTypeFormatter(GameType ?? GameName)] || gameTypeFormatter(GameType ?? GameName) || GameType || GameName;
  console.log(GameName,'asdsadasd')
  console.log('Evo betData', betData);
  console.log('Evo GameInfo', GameInfo);

  return (
    <Space direction="vertical">
      <RouletteDesc betData={betData} formattedGameType={formattedGameType} data={data} />
      <Panel>
        <RouletteResults data={GameInfo} />
      </Panel>
    </Space>
  );
};

export default Roulette;
