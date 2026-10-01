import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Divider,
  Space,
  Tabs,
  Form,
  Row,
  Col,
  Input,
  Switch,
  Button,
  Table,
  Tag,
  Pagination,
  notification,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "@/components/Breadcrumb";
import SearchBtn from "@/components/SearchBtn";
import {
  sportsAdminBoardsAPI,
  sportsAdminOddsAPI,
  SportsAdminBoard,
  SportsAdminBoardInfo,
  SportsAdminGame,
  SportsAdminMarket,
  SportsAdminOddsSide,
} from "@/api/sports-admin/get";
import { saveOverrideAPI } from "@/api/sports-admin/put";
import { closeGameAPI, clearGameAPI } from "@/api/sports-admin/post";

interface SideRow {
  gameId: string;
  market: SportsAdminMarket;
  side: SportsAdminOddsSide;
}

// One row per bettable side — the finest target PUT /overrides takes. Each row
// carries its own pending edits so "저장" submits exactly that target's state,
// no diffing against the server value needed.
const SideEditor = ({
  board,
  row,
  onSaved,
}: {
  board: SportsAdminBoard;
  row: SideRow;
  onSaved: () => void;
}) => {
  const { t } = useTranslation();
  const [odds, setOdds] = useState(String(row.side.overrideOdds ?? row.side.feedOdds ?? ""));
  const [closed, setClosed] = useState(row.side.closed);
  const [hidden, setHidden] = useState(row.side.hidden);
  const [reason, setReason] = useState(row.side.reason ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setOdds(String(row.side.overrideOdds ?? row.side.feedOdds ?? ""));
    setClosed(row.side.closed);
    setHidden(row.side.hidden);
    setReason(row.side.reason ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.side.overrideOdds, row.side.closed, row.side.hidden, row.side.reason]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await saveOverrideAPI({
        board,
        gameId: row.gameId,
        marketType: row.market.marketType,
        ...(row.market.marketKey ? { marketKey: row.market.marketKey } : {}),
        line: row.side.line,
        side: row.side.side,
        odds: odds ? Number(odds) : undefined,
        closed,
        hidden,
        reason: reason || undefined,
      });
      if (res.data.code === 0) {
        notification.success({ message: res.data.message || t("toast.common.updateSuccess") });
        onSaved();
      } else {
        notification.error({ message: res.data.message });
      }
    } catch {
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      setSaving(false);
    }
  };

  return (
    // Fixed-width grid columns (not a free-flowing Space) so home/draw/away
    // rows on the same market — and every market's rows on the page — line up
    // into clean columns instead of drifting with each side's label width.
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "68px 44px 76px 92px 92px minmax(110px,1fr) 60px",
        gap: 8,
        alignItems: "center",
      }}
    >
      <span style={{ color: "#999" }}>
        {row.side.side}
        {row.side.line !== null ? ` ${row.side.line > 0 ? "+" : ""}${row.side.line}` : ""}
      </span>
      <span style={{ color: "#bbb", fontSize: 12, textAlign: "right" }} title={t("sportsAdmin.feedOdds")}>
        {row.side.feedOdds ?? "-"}
      </span>
      <Input size="small" value={odds} onChange={(e) => setOdds(e.target.value)} />
      <span title={t("sportsAdmin.closedHint")} style={{ whiteSpace: "nowrap" }}>
        {t("sportsAdmin.closed")} <Switch size="small" checked={closed} onChange={setClosed} />
      </span>
      <span title={t("sportsAdmin.hiddenHint")} style={{ whiteSpace: "nowrap" }}>
        {t("sportsAdmin.hidden")} <Switch size="small" checked={hidden} onChange={setHidden} />
      </span>
      <Input
        size="small"
        placeholder={t("sportsAdmin.reasonPlaceholder")}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <Button size="small" type="primary" loading={saving} onClick={save}>
        {t("global.save")}
      </Button>
    </div>
  );
};

const GameCard = ({
  board,
  game,
  onChanged,
}: {
  board: SportsAdminBoard;
  game: SportsAdminGame;
  onChanged: () => void;
}) => {
  const { t } = useTranslation();

  const closeGame = async () => {
    try {
      const res = await closeGameAPI({ board, gameId: game.gameId, closed: true, hidden: false });
      if (res.data.code === 0) {
        notification.success({ message: res.data.message });
        onChanged();
      } else notification.error({ message: res.data.message });
    } catch {
      notification.error({ message: t("toast.common.updateFailed") });
    }
  };

  const clearGame = async () => {
    try {
      const res = await clearGameAPI({ board, gameId: game.gameId });
      if (res.data.code === 0) {
        notification.success({ message: res.data.message });
        onChanged();
      } else notification.error({ message: res.data.message });
    } catch {
      notification.error({ message: t("toast.common.updateFailed") });
    }
  };

  const rows: SideRow[] = game.markets.flatMap((market) =>
    market.sides.map((side) => ({ gameId: game.gameId, market, side }))
  );

  const columns: ColumnsType<SportsAdminMarket> = [
    {
      title: t("col.market"),
      dataIndex: "marketType",
      width: 100,
      render: (_, market) => (
        <span>
          {market.marketType}
          {market.homeStandard !== null ? ` (${market.homeStandard})` : ""}
        </span>
      ),
    },
    {
      title: t("sportsAdmin.oddsColumn"),
      key: "sides",
      render: (_, market) => (
        <Space direction="vertical" size={2}>
          {market.sides.map((side) => (
            <SideEditor
              key={`${game.gameId}:${market.marketId}:${side.side}`}
              board={board}
              row={{ gameId: game.gameId, market, side }}
              onSaved={onChanged}
            />
          ))}
        </Space>
      ),
    },
  ];

  return (
    <Card
      size="small"
      style={{ marginBottom: 12 }}
      title={
        <Space>
          <span>{game.sport}</span>
          <span style={{ color: "#999" }}>{game.league}</span>
          <span>
            {game.homeTeam} vs {game.awayTeam}
          </span>
          <span style={{ color: "#999", fontSize: 12 }}>{game.gameDatetime}</span>
          {game.gameOverride && <Tag color="red">{t("sportsAdmin.closedBadge")}</Tag>}
        </Space>
      }
      extra={
        <Space>
          <Button
            size="small"
            type="primary"
            danger
            style={{ borderColor: "#fff", color: "#fff" }}
            onClick={closeGame}
          >
            {t("sportsAdmin.closeGame")}
          </Button>
          <Button size="small" onClick={clearGame}>
            {t("sportsAdmin.clearGame")}
          </Button>
        </Space>
      }
    >
      <Table
        size="small"
        rowKey={(m) => m.marketId}
        columns={columns}
        dataSource={game.markets}
        pagination={false}
      />
      {rows.length === 0 && <span style={{ color: "#999" }}>{t("global.noData")}</span>}
    </Card>
  );
};

const SportsAdminOddsList = () => {
  const { t } = useTranslation();
  const [boards, setBoards] = useState<SportsAdminBoardInfo[]>([]);
  const [board, setBoard] = useState<SportsAdminBoard>("domestic");
  const [form] = Form.useForm();

  const { swr, paginationProps, setFilters } = sportsAdminOddsAPI(board);

  useEffect(() => {
    sportsAdminBoardsAPI().then((res) => {
      if (res.data.data?.length) {
        setBoards(res.data.data);
        setBoard(res.data.data[0].board);
      }
    });
  }, []);

  const games = swr.data?.data.games ?? [];
  const pagination = swr.data?.data.pagination;

  return (
    <Card>
      <Breadcrumb replace={t("sportsAdmin.oddsMenu")} />
      <Divider />

      <Tabs
        activeKey={board}
        onChange={(key) => setBoard(key as SportsAdminBoard)}
        items={boards.map((b) => ({ key: b.board, label: b.label }))}
      />

      <Form
        form={form}
        layout="inline"
        onFinish={(values) =>
          setFilters((prev: any) => ({
            ...prev,
            sport: values.sport || undefined,
            league: values.league || undefined,
            keyword: values.keyword || undefined,
            gameId: values.gameId || undefined,
            upcomingOnly: values.upcomingOnly,
          }))
        }
        initialValues={{ upcomingOnly: true }}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col>
            <Form.Item name="sport" style={{ margin: 0 }}>
              <Input size="small" placeholder={t("sportsAdmin.sportPlaceholder")} allowClear />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="league" style={{ margin: 0 }}>
              <Input size="small" placeholder={t("col.league")} allowClear />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="keyword" style={{ margin: 0 }}>
              <Input size="small" placeholder={t("sportsAdmin.keywordPlaceholder")} allowClear />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="upcomingOnly" valuePropName="checked" style={{ margin: 0 }}>
              <Switch
                checkedChildren={t("sportsAdmin.upcomingOnly")}
                unCheckedChildren={t("sportsAdmin.allGames")}
              />
            </Form.Item>
          </Col>
          <Col>
            <SearchBtn size="small" />
          </Col>
        </Row>
      </Form>

      <Divider />

      {games.map((game) => (
        <GameCard key={game.gameId} board={board} game={game} onChanged={() => swr.mutate()} />
      ))}

      {games.length === 0 && !swr.isLoading && (
        <div style={{ textAlign: "center", color: "#999", padding: 24 }}>
          {t("global.noData")}
        </div>
      )}

      {pagination && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Pagination size="small" {...paginationProps(pagination.totalItems)} />
        </div>
      )}
    </Card>
  );
};

export default SportsAdminOddsList;
