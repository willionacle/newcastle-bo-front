import { Flex, Space, Spin } from "antd";
import { BetDetailsProp } from "@/pages/betting/record/List";
import { getBetDetails } from "@/api/bet-details/get";
import BetTable from "./BetTable";
import BetDesc from "./BetDesc";
import Panel from "@/components/Panel";
interface Prop {
  data?: BetDetailsProp;
}

const EvoslotRenderHtml = ({ data }: Prop) => {
  const {data: NewEvoBetData, isLoading} = getBetDetails({
    username: data?.record?.username!, 
    gameid: data?.record?.req_id!, 
    game_history: data?.vendor, 
    created_at: data?.record?.created_at,
    transaction_id: data?.record?.transaction_id,
  });

  console.log("EVOSLOT RES", NewEvoBetData?.data.data);

  if (isLoading) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }
return  (
    <Space direction="vertical">
      <BetDesc 
        newData={NewEvoBetData?.data?.data?.raw?.data}
        record={data?.record}
      />
      <Panel>
        <Flex justify="center" className="">
          <iframe width={1000} height={600} srcDoc={NewEvoBetData?.data.url} style={{minWidth: 1000, minHeight: 600}}></iframe>
          {/* <div dangerouslySetInnerHTML={{ __html: NewEvoBetData?.data.html! || NewEvoBetData?.data.url!}} style={{minWidth: 1000, minHeight: 600}} /> */}
        </Flex>
      </Panel>
      <BetTable 
        data={(NewEvoBetData?.data?.data?.raw?.data?.participants?.[0]?.bets) || []} 
      /> 
    </Space>
    
  )
};

export default EvoslotRenderHtml;
