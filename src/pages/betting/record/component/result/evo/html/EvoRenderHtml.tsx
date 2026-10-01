import { Flex, Space, Spin } from "antd";
import { BetDetailsProp } from "@/pages/betting/record/List";
import { getBetDetails } from "@/api/bet-details/get";
import BetDesc from "./BetDesc";
import ResultHtml from "./ResultHtml";
import BetTable from "./BetTable";
import Panel from "@/components/Panel";
import RecursiveTable from "./RecursiveTable";
interface Prop {
  data?: BetDetailsProp;
}

const EvoRenderHtml = ({ data }: Prop) => {
  const {data: NewEvoBetData, isLoading} = getBetDetails({
    username: data?.record?.username!, 
    gameid: data?.record?.req_id!, 
    game_history: data?.vendor, 
    created_at: data?.record?.created_at,
    transaction_id: data?.record?.transaction_id,
  });

  console.log(NewEvoBetData);

  if (isLoading) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }

  try {
    return (
      <Space direction="vertical">
        <BetDesc 
          newData={NewEvoBetData?.data?.data}
        />
        <Panel>
          <ResultHtml 
            url={NewEvoBetData?.data?.url!}
            result={NewEvoBetData?.data.data.raw.data.result}
          />
        </Panel>
        <BetTable 
          data={NewEvoBetData?.data?.data?.raw?.data?.participants[0].bets || []} 
        /> 
      </Space>
    );
  } catch (error) {
    console.error(error);
    if (NewEvoBetData?.data?.url) {
      <ResultHtml 
        url={NewEvoBetData?.data?.url!}
        result={NewEvoBetData?.data.data.raw.data.result} 
      />
    }
    return <RecursiveTable data={NewEvoBetData?.data.data.raw.data.result}/>
  }
};

export default EvoRenderHtml;
