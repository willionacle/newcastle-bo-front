import { BetLogData } from "@/api/betting-logs/get"
import { Flex } from "antd"
import RecursiveTable from "./RecursiveTable"
import { useMemo } from "react"
import { GF } from "@/utils/GlobalFunctions"
import dayjs from "dayjs"
import commaNumber from "comma-number"
import Panel from "@/components/Panel"


const LotusBetDetails = ({record}:{record: BetLogData}) => {

  const data = useMemo(() => {
    let resultJson = GF.isValidJSON(record.result_json) ? JSON.parse(record.result_json) : undefined;
    let betData = GF.isValidJSON(record.bet_data) ? JSON.parse(record.bet_data) : undefined;
    if (resultJson) {
      resultJson = {
        ...resultJson,
        sdate: dayjs(resultJson?.sdate).format("YYYY-MM-DD HH:mm:ss"),
        ch: commaNumber(resultJson.ch)
      }
    }
    if (betData) {
      betData = {
        ...betData,
        bet_amount: commaNumber(betData.bet_amount),
        bet_round: commaNumber(betData.bet_round)
      }
    }

    return {
      resultJson,
      betData
    }
  }, [record]);

  return (
    <>
    <Panel>
      <Flex justify="center" gap={10} vertical>
        <RecursiveTable data={data.betData} />
        <RecursiveTable data={data.resultJson} />
      </Flex>
    </Panel>
    </>
  )
}

export default LotusBetDetails;