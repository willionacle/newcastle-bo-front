import { Empty, Flex } from "antd";
import { BetDetailsProp } from "../../../List";
import ResultLink from "../../result/mg/ResultLink";
// import BaccaratResult from "../../result/pp/BaccaratResult";

export interface PPProp {
  data?: BetDetailsProp;
}

const MGBetDetails = ({ data }: PPProp) => {
  // console.log('Non Sport', data);
  console.log('PP Bet Details', data);

  if (data) {
    return  <ResultLink data={data} />
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

export default MGBetDetails;
