import Panel from "@/components/Panel";
import { BetDetailsProp } from "@/pages/betting/record/List";
import { Space } from "antd";
import DragonTigerResult from "./DragonTigerResult";
import DragonTigerDesc from "./DragonTigerDesc";

export interface PPProp {
  data?: BetDetailsProp;
}

export interface AGDragonTigerType {
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

const DragonTiger = ({ data }: PPProp) => {
  const gameData = data?.record?.bet_detail_result as unknown as any;
  const parsedData = JSON.parse(gameData).data[0] as AGDragonTigerType;
  console.log(parsedData, "ag details");

  return (
    <Space direction="vertical">
      <DragonTigerDesc data={data} gameData={parsedData} />
      <Panel>
        <DragonTigerResult GameInfo={parsedData.gameResult} />
      </Panel>
    </Space>
  );
};

export default DragonTiger;
