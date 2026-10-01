import { Empty, Flex } from "antd";
import { BetDetailsProp } from "../../../List";
import SlotResult from "../../result/pp/SlotResult";
// import BaccaratResult from "../../result/pp/BaccaratResult";

export interface PPProp {
  data?: BetDetailsProp;
}

const PPBetDetails = ({ data }: PPProp) => {
  // console.log('Non Sport', data);
  console.log('PP Bet Details', data);

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

export default PPBetDetails;
