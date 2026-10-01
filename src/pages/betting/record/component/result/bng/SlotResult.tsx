import { Empty, Flex } from "antd";
import { BetDetailsProp } from "../../../List";
import { getBetDetails2 } from "@/api/bet-details/get";

interface Prop {
  data?: BetDetailsProp;
}

const SlotResult = ({ data }: Prop) => {
  const { data: newData, isLoading } = getBetDetails2({
    username: data?.record?.username!,
    gameid: data?.record?.game_key!,
    roundid: data?.record?.session,
    game: data?.record?.game_history,
  });

  const resultLink = newData?.data?.data?.url;

  return (
    !isLoading && (
      <Flex justify="center" className="">
        {resultLink ? (
          <iframe src={resultLink} width={1000} height={600} />
        ) : (
          <Empty />
        )}
      </Flex>
    )
  );
};

export default SlotResult;
