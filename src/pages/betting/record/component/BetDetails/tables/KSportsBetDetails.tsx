import { BetLogData } from "@/api/betting-logs/get";
import i18next from "@/i18n/i18n";
import { GF } from "@/utils/GlobalFunctions";
import { Flex, Image, Table, TableProps } from "antd";
import commaNumber from "comma-number";
import dayjs from "dayjs";

export interface KSportsBetHistory {
  id: number;
  username: string;
  key: string;
  game_type: string; 
  bet_amount: number;
  total_odds: string;
  win_amount: number;
  status: number; 
  prev_balance: number;
  after_balance: number;
  is_delete: number;
  created_at: string; 
  created_ip: string;
  resulted_at?: string; 
  details: BetDetail[];
}

export interface BetDetail {
  id: number;
  sports_bet_history_id: number;
  odds_key: string;
  market_id: number;
  sports_name: string;      
  sports_name_kr: string;   
  country: string;         
  country_kr: string;      
  country_image: string;
  home_name: string;
  home_image: string;
  away_name: string;
  away_image: string;
  league_name: string;
  league_image: string;
  score: string;            
  start_datetime: string;   
  home_odds: string;
  away_odds: string;
  odds_line?: string;       
  odds: number;
  bet_type: number;          
  result_type: number;       
  status: number;            
  resulted_at?: string;
  match_id: number;
}

const betStatus = (status: number) => {
  switch (status) {
    case 0:
      return <span>{i18next.t("global.waiting")}</span>;
    case 1:
      return <span style={{ color: "blue" }}>{i18next.t("sportsBet.statusHit")}</span>;
    case 2:
      return <span style={{ color: "red" }}>{i18next.t("sportsBet.statusMiss")}</span>;
    case 3:
      return <span style={{ color: "orange" }}>{i18next.t("sportsBet.statusCancelSpecial")}</span>;
    case 4:
      return <span style={{ color: "purple" }}>{i18next.t("sportsBet.statusUserCancel")}</span>;
    case 5:
      return <span style={{ color: "purple" }}>{i18next.t("sportsBet.statusAdminCancel")}</span>;
    default:
      return <span>-</span>;
  }
}

const parentColumn: TableProps<KSportsBetHistory>["columns"] = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "ID",
    dataIndex: "username",
    align: "center",
  },
  {
    title: i18next.t("sportsBet.betKey"),
    dataIndex: "key",
    align: "center",
  },
  {
    title: i18next.t("sportsBet.gameType"),
    dataIndex: "game_type",
    align: "center",
  },
  {
    title: i18next.t("col.status"),
    dataIndex: "status",
    key: "status",
    align: "center",
    render: betStatus
  },
  {
    title: i18next.t("sportsBet.totalOdds"),
    dataIndex: "total_odds",
    key: "total_odds",
    sorter: true,
    align: "center",
    width: "8%",
  },
  {
    title: i18next.t("col.betAmount"),
    dataIndex: "bet_amount",
    key: "bet_amount",
    sorter: true,
    align: "center",
    render: (value: number) => <>{commaNumber(value)}</>,
  },
  {
    title: i18next.t("col.winningAmount"),
    dataIndex: "win_amount",
    key: "win_amount",
    sorter: true,
    align: "center",
    render: (value: number) => <>{commaNumber(value)}</>,
    width: "8%",
  },
  {
    title: i18next.t("col.previousBalance"),
    dataIndex: "prev_balance",
    key: "prev_balance",
    sorter: true,
    align: "center",
    render: (value: number) => <>{commaNumber(value)}</>,
    width: "8%",
  },
  {
    title: i18next.t("title.afterBalance"),
    dataIndex: "after_balance",
    key: "after_balance",
    sorter: true,
    align: "center",
    render: (value: number) => <>{commaNumber(value)}</>,
    width: "8%",
  },
  {
    title: i18next.t("sportsBet.betTime"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    sorter: true,
    render: (value: string) => (
      <>{dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss")}</>
    ),
  },
  {
    title: "IP",
    dataIndex: "created_ip",
    key: "created_ip",
    align: "center",
  },
  {
    title: i18next.t("title.resultTime"),
    dataIndex: "resulted_at",
    key: "resulted_at",
    align: "center",
    render: (value: string) => (
      <>{dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss")}</>
    ),
  },
];

const detailColumns: TableProps<BetDetail>["columns"] = [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: "",
    dataIndex: "match_id",
    key: "match_id",
    align: "center",
  },
  {
    title: i18next.t("col.sport"),
    dataIndex: "sports_name_kr",
    key: "sports_name_kr",
    align: "center",
  },
  {
    title: i18next.t("col.league"),
    dataIndex: "league_name",
    key: "league_name",
    align: "center",
    render: (_, r) => (
      <Flex gap={4} justify="center">
        <Image src={r.league_image} width={12} />
        <div className="">{r.league_name}</div>
      </Flex>
    ),
  },
  {
    title: i18next.t("col.home"),
    key: "home_name",
    render: (_, r) => (
      <Flex gap={4}>
        <Image src={r.home_image} width={20} />
        <div className="font-bold">{r.home_name} <span style={{opacity:0.7}}>({r.home_odds})</span></div>
      </Flex>
    ),
  },
  {
    title: i18next.t("sportsBet.draw"),
    align: "center",
    render: (_, record) => (
      <div
        style={{
          backgroundColor: record.bet_type === 2 ? "#e6f7ff" : "transparent",
          border: record.result_type === 2 ? "2px solid #1890ff" : "",
          padding: "8px",
        }}
      >
        {record.odds_line || "VS"}
      </div>
    ),
  },
  {
    title: i18next.t("col.away"),
    key: "away_name",
    render: (_, r) => (
      <Flex gap={4} justify="end">
        <div className="font-bold"><span style={{opacity:0.7}}>({r.away_odds})</span> {r.away_name} </div>
        <Image src={r.away_image} width={20} />
      </Flex>
    ),
  },
  {
    title: i18next.t("col.bet"),
    dataIndex: "bet_type",
    key: "bet_type",
    align: "center",
    render: (value) => ["패", "승", "무"][value] || "",
  },
  {
    title: i18next.t("col.result"),
    dataIndex: "result_type",
    key: "result_type",
    align: "center",
    render: (value) => ["패", "승", "무"][value] || "-",
  },
  {
    title: i18next.t("sportsBet.score"),
    dataIndex: "score",
    key: "score",
    align: "center",
    render: (value) => <>{value || "-"}</>,
  },
  {
    title: i18next.t("col.status"),
    dataIndex: "status",
    key: "status",
    width: 110,
    render: betStatus,
  },
  {
    title: i18next.t("sportsBet.matchTime"),
    dataIndex: "start_datetime",
    key: "start_datetime",
    align: "center",
    render: (value) => dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: i18next.t("title.resultTime"),
    dataIndex: "resulted_at",
    key: "resulted_at",
    align: "center",
    render: (value) => dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss"),
  },
];

const KSportsBetDetails = ({record}:{record: BetLogData}) => {

  const dataSource: KSportsBetHistory[] = GF.isValidJSON(record.bet_details) ? JSON.parse(record.bet_details) : [];  

  return (
    <Table
      sticky 
      columns={parentColumn}
      dataSource={dataSource}
      tableLayout="auto"
      rowKey={(r) => r.id}
       expandable={{
        expandedRowRender: (record) => (
          <Table
            rowKey={(r) => r.id}
            columns={detailColumns}
            dataSource={record.details}
            size="small"
            pagination={false}
          />
        ),
        rowExpandable: (record) => record.details?.length > 0,
        defaultExpandedRowKeys: dataSource.length ? [dataSource[0].id] : [],
      }}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={false}
    />
  )
}

export default KSportsBetDetails;