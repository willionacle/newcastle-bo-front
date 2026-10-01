import { Empty, Flex } from "antd";
import { BetDetailsProp } from "../../../List";
import { getResultLink } from "@/api/result-link/get";

interface Prop {
  data?: BetDetailsProp;
}

const SlotResult = ({ data }: Prop) => {
  // console.log('Non Sport', data);
   const {data: resultLink, isLoading} = getResultLink(data && data.bet_top_details ? data?.bet_top_details[0].id : 0);

  return !isLoading && resultLink && (
    <Flex justify="center" className="">
      {resultLink.url ? (
        <iframe src={resultLink.url} width={1000} height={600} />
      ) : (
        <Empty />
      )}
    </Flex>
  );
};

export default SlotResult;
