import { Empty, Flex, Spin } from "antd";
import { getBetDetails2 } from "@/api/bet-details/get";
import { BetDetailsProp } from "@/pages/betting/record/List";

interface Prop {
  data?: BetDetailsProp;
  url?: string;
  isHtmlDoc?: boolean;  
}

const BetResultURL = ({ data,url, isHtmlDoc = false }: Prop) => {
  if (url) {
    return (
      <Flex justify="center">
        <iframe src={url} width={1000} height={600} />
      </Flex>
    );
  }
  
  const { data: newData, isLoading } = getBetDetails2({
    username: data?.record?.username!,
    gameid: data?.record?.game_key!,
    roundid: data?.record?.session,
    game: data?.record?.game_history,
    transaction_id: data?.record?.transaction_id
  });

   if (isLoading) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }

  const resultLink = newData?.data?.data?.url || newData?.data?.url || undefined;

  return (
    <Flex justify="center" className="">
      {resultLink ? (
        <iframe src={isHtmlDoc ? undefined : resultLink} srcDoc={isHtmlDoc ? resultLink : undefined} width={1000} height={600} />
      ) : (
        <Empty />
      )}
    </Flex>
  );
};

export default BetResultURL;
