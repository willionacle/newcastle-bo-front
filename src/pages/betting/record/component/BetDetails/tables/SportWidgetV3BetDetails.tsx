import { BetLogData, SportWidgetV3Leg, SportWidgetV3LegResult } from "@/api/betting-logs/get";
import i18next from "@/i18n/i18n";
import { Descriptions, Table, TableProps, Tag } from "antd";
import commaNumber from "comma-number";
import dayjs from "dayjs";

const fmtDate = (value?: string | null) =>
  value ? dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss") : "-";

const resultTag = (result: SportWidgetV3LegResult | BetLogData["status"]) => {
  switch (result) {
    case "WON":
    case "WIN":
      return <Tag color="green">{i18next.t("sportsBet.win")}</Tag>;
    case "LOST":
    case "LOSE":
      return <Tag color="red">{i18next.t("sportsBet.lose")}</Tag>;
    case "CANCELLED":
      return <Tag>{i18next.t("global.cancel")}</Tag>;
    case "DRAW":
      return <Tag color="orange">{i18next.t("sportsBet.draw")}</Tag>;
    default:
      return <Tag color="blue">{i18next.t("status.waiting")}</Tag>;
  }
};

const combinedOdds = (record: BetLogData, legs: SportWidgetV3Leg[]) => {
  try {
    const betData = JSON.parse(record.bet_data ?? "{}");
    if (typeof betData.combinedOdds === "number") return betData.combinedOdds;
  } catch {
    // fall through to computed fallback
  }
  return legs.reduce((acc, leg) => acc * (Number(leg.odds) || 1), 1);
};

const legPickLabel = (leg: SportWidgetV3Leg) => {
  if (leg.selection === "home") return leg.homeTeam;
  if (leg.selection === "away") return leg.awayTeam;
  if (leg.selection === "draw") return i18next.t("sportsBet.draw");
  if (leg.line !== null && leg.line !== undefined) {
    const sign = leg.line > 0 ? "+" : "";
    return `${leg.selection} (${sign}${leg.line})`;
  }
  return leg.selection;
};

const columns: TableProps<SportWidgetV3Leg>["columns"] = [
  { title: "#", dataIndex: "legNo", align: "center", width: 48 },
  { title: i18next.t("col.sport"), dataIndex: "sport", align: "center" },
  {
    title: i18next.t("title.matchTitle"),
    key: "match",
    render: (_, leg) => (
      <div>
        {leg.league && (
          <div style={{ fontSize: 11, opacity: 0.7 }}>{leg.league}</div>
        )}
        <div>
          {leg.homeTeam} vs {leg.awayTeam}
        </div>
      </div>
    ),
  },
  { title: i18next.t("col.market"), dataIndex: "marketType", align: "center" },
  {
    title: i18next.t("title.select"),
    key: "selection",
    align: "center",
    render: (_, leg) => legPickLabel(leg),
  },
  { title: i18next.t("col.odds"), dataIndex: "odds", align: "center" },
  {
    title: i18next.t("col.finalScore"),
    key: "score",
    align: "center",
    render: (_, leg) => `${leg.homeScore ?? "-"} : ${leg.awayScore ?? "-"}`,
  },
  {
    title: i18next.t("col.result"),
    dataIndex: "result",
    align: "center",
    render: resultTag,
  },
  {
    title: i18next.t("sportsBet.matchTime"),
    dataIndex: "gameDatetime",
    align: "center",
    render: fmtDate,
  },
  {
    title: i18next.t("title.resultTime"),
    dataIndex: "settledAt",
    align: "center",
    render: fmtDate,
  },
];

const SportWidgetV3BetDetails = ({ record }: { record: BetLogData }) => {
  const legs = record.legs ?? [];

  return (
    <>
      <Descriptions
        bordered
        size="small"
        column={3}
        style={{ marginBottom: "1rem" }}
      >
        <Descriptions.Item label={i18next.t("col.transactionId")}>
          {record.transaction_id}
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("global.user")}>
          {record.user_real_name || record.username}
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.status")}>
          {resultTag(record.status)}
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.betAmount")}>
          {commaNumber(record.bet_amount)}
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.winningAmount")}>
          {commaNumber(record.win_amount)}
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.profitLoss")}>
          {commaNumber(record.win_loss)}
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.betDateTime")} span={3}>
          {fmtDate(record.bet_date)}
        </Descriptions.Item>
      </Descriptions>

      <Table<SportWidgetV3Leg>
        rowKey="legNo"
        size="small"
        columns={columns}
        dataSource={legs}
        pagination={false}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        summary={() =>
          legs.length > 0 ? (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row className="font-bold" style={{ backgroundColor: "#f0f1f7" }}>
                <Table.Summary.Cell index={0} colSpan={5} align="right">
                  {i18next.t("col.total")}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  <Tag color="default">{combinedOdds(record, legs).toFixed(2)}</Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={4}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          ) : null
        }
      />
    </>
  );
};

export default SportWidgetV3BetDetails;
