import i18next from "@/i18n/i18n";
import { Table, TableProps } from "antd"
import { GF } from "@/utils/GlobalFunctions";
import CommaNumber from "@/components/CommaNumber";
import { NewEvoBetData } from "@/api/bet-details/get";

type NewBetData = NewEvoBetData['raw']['data']['participants'][0]['bets'][0];

interface Props {
  // data: BetData[];
  data: NewBetData[];
}

const BetTable = ({data}: Props) => {

  const columns: TableProps<NewBetData>["columns"] = [
    {
      title: i18next.t("col.transactionId"),
      align: 'center',
      key: 'transactionId',
      dataIndex: 'transactionId',
    },
    {
      title: i18next.t("title.betType"),
      align: 'center',
      key: 'code',
      dataIndex: 'code',
      render: (value) => <div className="" style={{minWidth: 100}}>{value}</div>
    },
    {
      title: i18next.t("col.bet"),
      align: 'center',
      key: 'stake',
      dataIndex: 'stake',
      render: (value) => <div className="" style={{minWidth: 120}}><CommaNumber value={value} /></div>
    },
    {
      title: i18next.t("sportsBet.win"),
      align: 'center',
      key: 'payout',
      dataIndex: 'payout',
      render: (value) => <div className="" style={{minWidth: 120}}><CommaNumber value={value} /></div>
    },
    {
      title: i18next.t("title.betTime"),
      align: 'center',
      key: 'placedOn',
      dataIndex: 'placedOn',
      render: (value) => <div className="" style={{minWidth: 150}}>{GF.convertToGMT(value)}</div>
    },
  ]

  return (
    <Table
      sticky
      dataSource={Array.isArray(data) ? data : []}
      columns={columns}
      tableLayout="auto"
      pagination={false}
    />
  )
}

export default BetTable;