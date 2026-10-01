import { EvoplayEvent, getBetDetails2 } from "@/api/bet-details/get";
import { BetLogData } from "@/api/betting-logs/get"
import SlotBetDetails from "./SlotBetDetails";
import { Flex, Spin } from "antd";
import MiniGameDetails from "./MiniGameDetails";


const EvoplayBetDetails = ({ record }: { record: BetLogData }) => {
  const { data: newData, isLoading } = getBetDetails2({
    username: record?.username!,
    game: record?.game_history,
    transaction_id: record?.bet_data_1
  });

  if (isLoading) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }

  if (record.game_type === "slot")
    return (
      <>
        {newData?.data.data.data.map((item: EvoplayEvent) => (
          <SlotBetDetails item={item} record={record} />
        ))}
      </>
    )

  if (record.game_type === "minigame")
    return (
      <>
        {newData?.data.data.data.map((item: EvoplayEvent) => (
          <MiniGameDetails item={item} record={record} />
        ))}
      </>
    )

}

export default EvoplayBetDetails;