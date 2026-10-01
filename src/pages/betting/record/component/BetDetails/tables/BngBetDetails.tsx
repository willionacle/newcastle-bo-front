import { Empty, Flex } from "antd";
import { BetDetailsProp } from "../../../List";
import SlotResult from "../../result/bng/SlotResult";

export interface PPProp {
  data?: BetDetailsProp;
}

const BngBetDetails = ({ data }: PPProp) => {
  // console.log('Non Sport', data);
  console.log('bng Bet Details', data);

  if (data) {
    return  <SlotResult data={data} />
  }

  // if (data && data?.category?.toLowerCase() === 'live') {
  //   return  <BaccaratResult data={data} />
  // }

  return (
    <Flex justify="center" className="">
      <Empty />
    </Flex>
  )
};

export default BngBetDetails;
