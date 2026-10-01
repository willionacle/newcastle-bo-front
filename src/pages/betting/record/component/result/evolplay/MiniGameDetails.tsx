
import { Card, Row, Col, Tag, Typography, Space, Tooltip } from "antd";
import { EvoplayEvent } from "@/api/bet-details/get";
import { renderStatus } from "../../../List";
import { BetLogData } from "@/api/betting-logs/get";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const { Text, Title } = Typography;

dayjs.extend(utc);
dayjs.extend(timezone);

function toNumber(v?: string | number | null) {
  if (v == null) return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(n: number, currency = "KRW") {
  try {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency }).format(n);
  } catch {
    return new Intl.NumberFormat("en-US").format(n);
  }
}

function prettyGame(abs?: string) {
  if (!abs) return "Evoplay Minigame";
  const normalized = abs.replace(/\\/g, "/");
  const seg = normalized.split("/").filter(Boolean).pop() || "Evoplay Minigame";
  return seg.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function safeParse<T = any>(s?: string): T | null {
  try {
    return s ? (JSON.parse(s) as T) : null;
  } catch {
    return null;
  }
}

function formatKSTFromEpoch(epochSeconds?: string, fallbackDate?: string) {
  if (epochSeconds) {
    const ms = toNumber(epochSeconds) * 1000;
    if (ms) return dayjs.utc(ms).tz("Asia/Seoul").format("YY-MM-DD HH:mm:ss");
  }
  return fallbackDate ? dayjs.utc(fallbackDate).tz("Asia/Seoul").format("YY-MM-DD HH:mm:ss") : "";
}


export default function MiniGameDetails({ item, record }: { item: EvoplayEvent, record: BetLogData }) {
  const d = item.data ?? {};
  const g = d.game ?? {};
  const resp = safeParse(g.response);

  const gameName = prettyGame(g.absolute_name);
  const action = (g.action || "start").toUpperCase();
  const roundId = g.round?.round_id || item.event_id;

  const username = d.user?.agregator_user_id || d.user?.user_id || "-";
  const currency = d.user?.currency || "KRW";
  const mode = d.user?.mode_as_string;

  // const denom = toNumber(d.denomination || 1);
  const before = toNumber(d.balance_before_pay);
  const after = toNumber(d.balance_after_pay);

  const spin = resp?.spin || {};
  const bet = toNumber(spin.bet ?? d.total_bet ?? 0);
  const choice = spin.choice ?? resp?.choice ?? "-";
  const totalWin = toNumber(spin.wins?.total ?? d.total_win ?? 0);

  const pf = resp?.provably_fair?.["0"] || resp?.provably_fair || {};
  const pfString: string | undefined = pf.string;
  const pfHash: string | undefined = pf.hash;

  const vendorTs = resp?.timestamp as number | undefined;
  const when = vendorTs
    ? dayjs.utc(vendorTs * 1000).tz("Asia/Seoul").format("YY-MM-DD HH:mm:ss")
    : formatKSTFromEpoch(item.time, item.date);

  return (
    <Card
      bordered
      style={{ boxShadow: "none", marginBottom:"5px"}}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Space size={8} wrap>
            <Title level={5} style={{ margin: 0 }}>{gameName}</Title>
            <Tag color="blue">{action}</Tag>
            {mode && <Tag color={mode === "REAL" ? "geekblue" : "default"}>{mode}</Tag>}
          </Space>
          <Text type="secondary" style={{ display: "block" }}>{when}</Text>
        </Col>
        <Col>{renderStatus(record)}</Col>
      </Row>

      <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
        <Col span={4}>
          <Text type="secondary">Round</Text>
          <div>
            <Tooltip title="Click to copy">
              <Text>{roundId}</Text>
            </Tooltip>
          </div>
        </Col>

        <Col span={3}>
          <Text type="secondary">User</Text>
          <div><Text>{username}</Text></div>
        </Col>

        <Col span={3}>
          <Text type="secondary">Bet</Text>
          <div><Text>{formatMoney(bet, currency)}</Text></div>
        </Col>

        <Col span={3}>
          <Text type="secondary">Choice</Text>
          <div><Text>{String(choice)}</Text></div>
        </Col>

        <Col span={4}>
          <Text type="secondary">Befor Balance</Text>
          <div>
            <Text>
              {formatMoney(before, currency)}
            </Text>
          </div>
        </Col>
        <Col span={4}>
          <Text type="secondary">After Balance</Text>
          <div>
            <Text>
              {formatMoney(after, currency)}{" "}
            </Text>
          </div>
        </Col>

        <Col span={3}>
          <Text type="secondary">Total Win</Text>
          <div><Text>{formatMoney(totalWin, currency)}</Text></div>
        </Col>

        {(pfHash || pfString) && (
          <Col xs={24} md={12} lg={8}>
            <Text type="secondary">Provably Fair</Text>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {pfString && (
                <Tooltip title="Copy seed|string">
                  <Text style={{ wordBreak: "break-all" }}>
                    {pfString}
                  </Text>
                </Tooltip>
              )}
              {pfHash && (
                <Tooltip title="Copy hash">
                  <Text style={{ wordBreak: "break-all" }}>
                    {pfHash}
                  </Text>
                </Tooltip>
              )}
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
}
