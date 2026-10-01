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

interface Card {
  Poker: string;
  Tag: string;
}

interface GameInfo {
  Points: number[];
  Cards: Card[]
}

function transformCard(card: string): string {
  const rankMap: Record<string, string> = {
    "1": "A", "11": "J", "12": "Q", "13": "K", "10": "T"
  };

  const match = card.match(/^([CHSD])(\d{1,2})$/);
  if (!match) return card; 

  const [_, suit, rank] = match;
  const newRank = rankMap[rank] || rank; 
  return `${newRank}${suit}`;
}

const PokerResult = ({ data }: Prop) => {
  // console.log('Non Sport', data);

  const {gameData} = data?.bet_data as unknown as BetData;
  const gameInfo: GameInfo = gameData && gameData.GameInfo ? JSON.parse(gameData.GameInfo) : {};

  const cards: GameInfo['Cards'] = gameInfo.Cards;

  const items: DescriptionsProps['items'] = [
    { key: 1, label: i18next.t("betting.gameId"), children: gameData.RoundNo}, // Game ID
    { key: 2, label: i18next.t("betting.provider"), children: 'CQ9'}, // Provider
    { key: 3, label: i18next.t("betting.tableInfo"), children: gameData.GameType}, // Table Information
    // { key: 4, label: '유저 배팅', children: baccResKRText[formattedGameType] || formattedGameType}, // User Betting
    { key: 4, label: i18next.t("betting.userBet"), children: '-'}, // User Betting
    { key: 5, label: i18next.t("betting.point"), children: gameInfo.Points.map((item, index) => `${item}${((gameInfo.Points.length - 1) > index) ? ', ' : ''}`)}, // Points
    { key: 5, label: i18next.t("col.betAmount"), children: <CommaNumber value={data?.record?.bet_amount} />}, // Betting Amount
    { key: 6, label: i18next.t("sportsMarket.winnings"), children: <CommaNumber value={data?.record?.win_amount} /> }, // Winnings
    { key: 7, label: i18next.t("title.betTime"), children: <DateText date={data?.record?.bet_date ?? null} timeStamp />}, // Betting Time
  ];

  const columns: TableProps<Card>["columns"] = [
    {
      title: i18next.t("title.card"), // Card
      dataIndex: 'Poker',
      render: (value: string) => <img height={70} src={`/images/cards/${transformCard(value)}.svg`} />
    },
    {
      title: i18next.t("title.suit"), // Suit
      dataIndex: 'Poker',
    },
    {
      title: i18next.t("title.tag"), // Tags
      dataIndex: 'Tag'
    }
  ]

  return (
    <Space direction="vertical">
      <Descriptions size="small" layout="vertical" items={items} column={4} />
      <Panel>
        <Table
          dataSource={cards}
          columns={columns}
          tableLayout="auto"
        />
      </Panel>
    </Space>
  )
};

export default PokerResult;
