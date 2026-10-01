import { Empty, Flex } from "antd";
import { BetDetailsProp } from "../../../List";
import PokerResult from "../../result/cq9/PokerResult";
import SlotResult from "../../result/cq9/SlotResult";

export interface PPProp {
  data?: BetDetailsProp;
}

const CQ9BetDetails = ({ data }: PPProp) => {
  // console.log('Non Sport', data);
  console.log('CQ9 Bet Details', data);

  if (data && data?.category?.toLowerCase() === 'live' && data.record?.bet_data.includes('Poker')) {
    return  <PokerResult data={data} />
  }

  if (data && data?.category?.toLowerCase() === 'slot') {
    return <SlotResult data={data} />
  }

  return (
    <Flex justify="center" className="">
      <Empty />
    </Flex>
  )
};

export default CQ9BetDetails;
