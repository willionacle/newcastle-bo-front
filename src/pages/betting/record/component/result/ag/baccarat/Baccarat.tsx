import Panel from "@/components/Panel"
import BaccaratResult from "./BaccaratResult"
import { BetDetailsProp } from "@/pages/betting/record/List";
import { Empty, Space } from "antd";
import BaccaratDesc from "./BaccaratDesc";

export interface PPProp {
  data?: BetDetailsProp;
}

export interface AGBaccaratType {
  isRefund: boolean;
  currency: string;
  playname: string;
  agentCode: string;
  settletime: string; 
  transactionID: string;
  billNo: string;
  gametype: string; 
  playtype: string;
  gameCode: string;
  val: string | null;
  transactionType: string; 
  netAmount: number;
  validBetAmount: number;
  gameResult: string;
  roundId: string | null;
  remark: string | null;
  refundAmount: number | null;
}

const Baccarat = ({ data }: PPProp) => {
  // const {gameData}: {gameData: AGBaccaratType} = data?.bet_data as unknown as any;
  const gameData = data?.record?.bet_detail_result as unknown as any;

  if(!gameData) return <Empty/>
  
  const parsedData = JSON.parse(gameData)?.data[0] as AGBaccaratType
  console.log(parsedData,"ag details")
  return (
    <Space direction="vertical">
      <BaccaratDesc data={data} gameData={parsedData} />
      <Panel>
        <BaccaratResult GameInfo={parsedData.gameResult} />
      </Panel>
    </Space>
  )
}

export default Baccarat;