import { Descriptions, DescriptionsProps, Space, Table, TableProps } from "antd";
import i18next from "@/i18n/i18n";
import { BetDetailsProp } from "../../../List";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import Panel from "@/components/Panel";

interface Prop {
  data?: BetDetailsProp;
}

interface GameData {
  GameInfo: string;
  GameName: string;
  GameType: string;
  RoundNo: string;
  TransType: string;
}

interface BetData {
  betData: string;
  gameData: GameData;
}

interface CQ9SlotBetData {
  Bonus: number;
  Freegame: number;
  Luckydraw: number;
}

const SlotResult = ({ data }: Prop) => {
  
  const {gameData, betData} = data?.bet_data as unknown as BetData;

  const newBetData = JSON.parse(betData) as CQ9SlotBetData[]
  console.log('CQ9 SLOT BETDFATA', newBetData);

  const items: DescriptionsProps['items'] = [
    { key: 1, label: i18next.t("betting.gameId"), children: gameData.RoundNo}, // Game ID
    { key: 2, label: i18next.t("betting.provider"), children: 'CQ9'}, // Provider
    { key: 3, label: i18next.t("betting.tableInfo"), children: gameData.GameType}, // Table Information
    { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={data?.record?.bet_amount} />}, // Betting Amount
    { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={data?.record?.win_amount} /> }, // Winnings
    { key: 7, label: i18next.t("title.betTime"), children: <DateText date={data?.record?.bet_date ?? null} timeStamp />}, // Betting Time
  ];

  const columns: TableProps<CQ9SlotBetData>["columns"] = [
    {
      title: i18next.t("sidemenu.bonus"), // Bonus
      dataIndex: 'Bonus',
    },
    {
      title: i18next.t("title.freeGame"), // Freegame
      dataIndex: 'Freegame',
    },
    {
      title: i18next.t("title.luckyDraw"), // Luckydraw
      dataIndex: 'Luckydraw',
    },
  ]

  return (
    <Space direction="vertical">
      <Descriptions size="small" layout="vertical" items={items} column={4} />
      <Panel>
        <Table
          dataSource={newBetData ?? []}
          columns={columns}
          tableLayout="auto"
          pagination={false}
        />
      </Panel>
    </Space>
  )
};

export default SlotResult;
