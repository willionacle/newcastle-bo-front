import { Empty, Flex } from "antd";
import { BetDetailsProp } from "../../../List";
import { getMGResultLink } from "@/api/result-link/get";

interface Prop {
  data?: BetDetailsProp;
}

const ResultLink = ({ data }: Prop) => {
  // console.log('Non Sport', data);
   const {data: resultLink, isLoading} = getMGResultLink({
    username: data?.record?.username!,
    betid: data?.record?.session!
  });

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

export default ResultLink;
