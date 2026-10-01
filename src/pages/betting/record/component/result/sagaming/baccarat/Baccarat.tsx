import { Flex, Space, Spin } from "antd";
import Panel from "@/components/Panel";
import BaccaratResults from "./BaccaratResults";
import BaccaratDesc from "./BaccaratDesc";
import { BetDetailsProp } from "@/pages/betting/record/List";
import { getSAGBetDetails } from "@/api/bet-details/get";
import { SAGBaccaratResult, SAGParsedBetData } from "@/api/bet-details/@types/sagaming";
import { GF } from "@/utils/GlobalFunctions";
import BaccaratBets from "./BaccaratBets";

interface Prop {
  data?: BetDetailsProp;
}

export const outComeResultDetail = (
  resultDetail?: SAGBaccaratResult["BaccaratResult"]["ResultDetail"]
) => {
  if (resultDetail?.BRTie === "true") return "Tie";
  if (resultDetail?.BRPlayerWin === "true") return "Player";
  if (resultDetail?.BRBankerWin === "true") return "Banker";

  return "";
};

const Baccarat = ({ data }: Prop) => {
  const {
    data: SAGBetData, 
    isLoading} = getSAGBetDetails({
      username: data?.record?.username!, 
      transaction_id: data?.record?.transaction_id! 
    })
 
  const betData: SAGParsedBetData | null = data?.record?.bet_data && GF.isValidJSON(data?.record?.bet_data) ? 
    JSON.parse(data?.record?.bet_data) 
    : null;

  const betList = SAGBetData?.data?.data?.data?.GetAllBetDetailsForTransactionIDResponse?.BetDetailList?.BetDetail;

  return isLoading ? (
     <Flex justify="center">
        <Spin />
      </Flex>
  ) : (
    <Space direction="vertical">
      <BaccaratDesc 
        data={data} 
        betDetails={SAGBetData?.data?.data} 
        betData={betData}
      />
      <Panel>
        <BaccaratResults 
          data={SAGBetData?.data?.data} 
        />
      </Panel>
      <BaccaratBets 
        data={betList ? [betList] : []} 
      /> 
    </Space>
  );
};

export default Baccarat;
