import { Card, Row, Col, Tag, Typography, Divider, Space, Tooltip } from "antd";
import { GF } from "@/utils/GlobalFunctions";
import { BetLogData } from "@/api/betting-logs/get";
import { renderStatus } from "../../../List";
import { EvoplayEvent } from "@/api/bet-details/get";

const { Text, Title } = Typography;

function toNumber(v?: string | number | null) {
    if (v == null) return 0;
    const n = typeof v === "number" ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : 0;
}

function formatMoney(amount: number, currency = "KRW") {
    try {
        return new Intl.NumberFormat("ko-KR", { style: "currency", currency }).format(amount);
    } catch {
        return new Intl.NumberFormat("en-US").format(amount);
    }
}

export default function SlotBetDetails({ item, record }: { item: EvoplayEvent, record: BetLogData }) {
    const d = item.data ?? {};
    const g = d.game ?? {};

    const roundId = g.round?.round_id || item.event_id;
    const gameName = record.game_name;
    const action = (g.action || "action").toUpperCase();
    const when = GF.cleanDateString(record.created_at, true);

    const username = d.user?.agregator_user_id || d.user?.user_id || "-";
    const currency = d.user?.currency || "KRW";
    const mode = d.user?.mode_as_string;

    // const denom = toNumber(d.denomination || 1);
    const bet = toNumber(d.bet);
    const lines = toNumber(d.lines);
    const totalWin = toNumber(d.total_win);
    // const payout = toNumber(d.payout); 
    const winShown = totalWin;

    const before = toNumber(d.balance_before_pay);
    const after = toNumber(d.balance_after_pay);

    return (
        <Card style={{
            boxShadow: "none"
        }}>
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

            <Divider style={{ margin: "12px 0" }} />

            <Row gutter={[16, 12]}>
                <Col span={4}>
                    <Text type="secondary">Round</Text>
                    <div>
                        <Tooltip title="Click to copy">
                            <Text>{roundId}</Text>
                        </Tooltip>
                    </div>
                </Col>

                <Col span={4}>
                    <Text type="secondary">User</Text>
                    <div><Text>{username}</Text></div>
                </Col>

                <Col span={4}>
                    <Text type="secondary">Bet × Lines</Text>
                    <div>
                        <Text>{formatMoney(bet, currency)} </Text>
                        <Text type="secondary">({toNumber(d.bet)} × {lines})</Text>
                    </div>
                </Col>

                {/* <Col span={4}>
                    <Text type="secondary">Bet Amount</Text>
                    <div>
                        <Text>
                            {formatMoney(bet, currency)}{" "}
                        </Text>
                    </div>
                </Col> */}

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
                            {/* <Text type={net > 0 ? "success" : net < 0 ? "danger" : "secondary"}>
                                ({net > 0 ? "+" : ""}{formatMoney(net, currency)})
                            </Text> */}
                        </Text>
                    </div>
                </Col>
                <Col span={4}>
                    <Text type="secondary">Win / Payout</Text>
                    <div>
                        <Text>
                            {formatMoney(winShown, currency)}{" "}
                            <Text type="secondary"> (×{String(g.multiplier ?? 1)})</Text>
                        </Text>
                    </div>
                </Col>
            </Row>
            <Divider style={{ margin: "12px 0" }} />
            
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${item?.data?.baraban_assets?.[0]?.length || 5}, 1fr)`,
                    gap: "6px",
                    justifyContent: "center",
                    padding: "10px",
                }}
            >
                {item?.data?.baraban_assets?.map((col: string[], colIndex: number) =>
                    col.map((img: string, rowIndex: number) => (
                        <div key={`${colIndex}-${rowIndex}`} style={{ textAlign: "center" }}>
                            <img
                                src={img}
                                alt={`symbol-${colIndex}-${rowIndex}`}
                                style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "contain",
                                    borderRadius: 6,
                                }}
                            />
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
