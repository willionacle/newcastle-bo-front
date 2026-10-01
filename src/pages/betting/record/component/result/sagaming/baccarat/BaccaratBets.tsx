import i18next from "@/i18n/i18n";
import { Table, TableProps } from "antd"
import { GF } from "@/utils/GlobalFunctions";
import CommaNumber from "@/components/CommaNumber";
import { SAGBetDetail } from "@/api/bet-details/@types/sagaming";


interface Props {
  // data: BetData[];
  data: SAGBetDetail["BetDetail"][];
}

const BaccaratBets = ({data}: Props) => {

  const columns: TableProps<SAGBetDetail["BetDetail"]>["columns"] = [
    {
      title: i18next.t("col.transactionId"),
      align: 'center',
      key: 'TransactionID',
      dataIndex: 'TransactionID',
    },
    // {
    //   title: i18next.t("title.betType"),
    //   align: 'center',
    //   key: 'code',
    //   dataIndex: 'code',
    //   render: (value) => <div className="" style={{minWidth: 100}}>{baccResKRText[gameTypeFormatter(value, "BAC_")] || value}</div>
    // },
    {
      title: i18next.t("col.bet"),
      align: 'center',
      key: 'BetAmount',
      dataIndex: 'BetAmount',
      render: (value) => <div className="" style={{minWidth: 120}}><CommaNumber value={value} /></div>
    },
    {
      title: i18next.t("sportsBet.win"),
      align: 'center',
      key: 'ResultAmount',
      dataIndex: 'ResultAmount',
      render: (value) => <div className="" style={{minWidth: 120}}><CommaNumber value={value} /></div>
    },
    {
      title: i18next.t("title.betTime"),
      align: 'center',
      key: 'BetTime',
      dataIndex: 'BetTime',
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

export default BaccaratBets;