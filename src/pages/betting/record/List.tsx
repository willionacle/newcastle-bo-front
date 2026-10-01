import i18next from "@/i18n/i18n";
import { BetLogData, BetLogType, MatchColor } from "@/api/betting-logs/get";
import { ResPostList } from "@/api/types";
import CommaNumber from "@/components/CommaNumber";
import DetailBtn from "@/components/DetailBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Button, Modal, PaginationProps, Table, TableProps } from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import BetDetails from "./component/BetDetails/BetDetails";
import { convertBetDetailsStatus } from "./component/BetDetails/handlers";
import { BetDetailsData, BetTopDetailsData } from "./types";
import { GameMaintenancesAPI } from "@/api/game-maintenances/get";
import {
  BetData,
  gameTypeFormatter,
  parseBetData,
  parseEvoBetData,
} from "./component/result/evo/baccarat/Baccarat";
import ColorizeUsername from "@/components/ColorizeUsername";
import MatchColorBadge from "./component/ColorBadge";
import CancelBetModal from "./component/CancelBetModal";
import SettleTicketModal from "./component/SettleTicketModal";

// bet_type values the backend accepts for admin-initiated cancel — domestic
// sports parlays settle under "itf_parlay", international under its own
// "itf_intl_parlay" (this backend does NOT share bet_type between the two,
// despite the reference doc's claim — confirmed against a live rp-user-front
// bet-history response, where international rows render "itf_intl_parlay" in
// the raw bet-type column), sports-special under "itf_special_parlay", and
// the trivia special-game under "special" (its game_id is "special_game",
// not this). Vendor/callback-settled products (casino, slot, external
// sports) are excluded — they have their own vendor cancel path.
const CANCELLABLE_BET_TYPES = new Set([
  "itf_parlay",
  "itf_intl_parlay",
  "itf_special_parlay",
  "special",
]);

interface Props {
  data: ResPostList["data"];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  totals?: BetLogType["totals"];
  category?: string;
  mutate?: () => void;
}

export interface BetDetailsProp {
  bet_top_details?: BetTopDetailsData[];
  bet_details?: BetDetailsData[];
  bet_data?: BetDetailsData[];
  category?: BetLogData["game_type"];
  vendor?: BetLogData["game_history"];
  record?: BetLogData;
}

export const renderStatus = (record: BetLogData) => {
  // sport_widget_v3 / itf_parlay report status from the player's point of view
  // (WON/LOST/PENDING/CANCELLED/DRAW) — checked first since these must render
  // even when the stake was refunded (bet_amount === win_amount, e.g. a push).
  if (record.status === "WON")
    return <span style={{ color: "var(--ant-color-error-text)" }}>{i18next.t("sportsBet.win")}</span>;
  else if (record.status === "LOST")
    return <span style={{ color: "var(--ant-color-info-text)" }}>{i18next.t("sportsBet.lose")}</span>;
  else if (record.status === "PENDING") return i18next.t("status.waiting");
  else if (record.status === "CANCELLED") return i18next.t("global.cancel");
  else if (record.status === "DRAW") return i18next.t("sportsBet.draw");
  else if (record.bet_amount === record.win_amount) return "";
  // legacy vendors report status from the operator's point of view (LOSE = site
  // lost = player won, WIN = site won = player lost) — hence the swapped labels.
  else if (record.status === "LOSE")
    return <span style={{ color: "var(--ant-color-error-text)" }}>{i18next.t("sportsBet.win")}</span>;
  else if (record.status === "WAITING") return i18next.t("status.waiting");
  else if (record.status === "WIN")
    return <span style={{ color: "var(--ant-color-info-text)" }}>{i18next.t("sportsBet.lose")}</span>;
  else if (record.status === "CANCEL") return i18next.t("global.cancel");
  else if (record.status === "TIE") return i18next.t("betting.turn_draw");
  else if (record.status === "TRANSFER") return i18next.t("betting.transfer");
  else return "-";
};

const categoryKRText: Record<string, string> = {
  live: i18next.t("title.live"),
  sports: i18next.t("memberDetail.mis133"),
  slot: i18next.t("memberDetail.mis132"),
  minigame: i18next.t("memberDetail.mis134"),
  fish: i18next.t("title.fishingGame"),
  card: i18next.t("gameCat.board"),
  arcade: i18next.t("gameCat.arcade"),
};

export const baccResKRText: Record<string, string> = {
  Banker: i18next.t("betting.banker"),
  Player: i18next.t("betting.player"),
  Tie: i18next.t("betting.turn_draw"),
  PlayerBonus: i18next.t("betting.playerBonus"),
  BankerBonus: i18next.t("betting.bankerBonus"),
  BankerPair: i18next.t("betting.bankerPair"),
  PlayerPair: i18next.t("betting.playerPair"),
  EitherPair: i18next.t("betting.eitherPair"),
  PerfectPair: i18next.t("betting.perfectPair"),
};

const List = ({ data, loading, pagination, onHeaderCell, totals,category, mutate }: Props) => {
  const [searchParams] = useSearchParams();
  const gameCategory = searchParams.get("game_category");
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [betDetailsOpen, setBetDetailsOpen] = useState<
    BetDetailsProp | undefined
  >(undefined);
  const [cancelTarget, setCancelTarget] = useState<BetLogData | undefined>(undefined);
  const [settleTarget, setSettleTarget] = useState<BetLogData | undefined>(undefined);
  const {
    swr: { data: GameList },
  } = GameMaintenancesAPI("");
  console.log(GameList);
  const handleDetailOpen = (record: BetLogData) => {
    // const {bet_details, bet_top_details} = record;
    let bet_details = JSON.parse(record.bet_details ?? "[]");
    const bet_data = GF.isValidJSON(record.bet_data)
      ? JSON.parse(record.bet_data ?? "[]")
      : [];
    // const bet_top_details = JSON.parse(record.bet_data ?? "[]");
    const category = record.game_type;
    const vendor = record.game_history;

    const newTopDetails = [
      {
        id: parseInt(record.id),
        username: record.username,
        reserve_id: record.transaction_id,
        match_type: record.game_division,
        odds:
          bet_data.Bets && bet_data.Bets.Bet[0]["$"].OddsDec
            ? bet_data.Bets.Bet[0]["$"].OddsDec
            : null,
        amount: record.bet_amount,
        expected_amount: bet_data.Bets ? bet_data.Bets.Bet[0]["$"].Gain : null,
        status: convertBetDetailsStatus(record.status),
        created_at: record.bet_date,
        match_color_name: record.match_color_name,
      },
    ];

    const bet_top_details = newTopDetails;

    if (record.status === "CANCEL" && bet_details.length > 0) {
      bet_details = bet_details.map((item: BetDetailsData) => ({
        ...item,
        tbxi_status: "Canceled",
      }));
      console.log("NEW BET DETAILS", bet_details);
    }
    if (bet_details && bet_top_details)
      setBetDetailsOpen({
        bet_data,
        bet_details,
        bet_top_details,
        category,
        vendor,
        record,
      });
  };

  const columnsArray: TableProps<BetLogData>["columns"] = [
    // {
    //   title: t("IDX(NO)"),
    //   dataIndex: "id",
    //   key: "id",
    //   width: '6%',
    //   align: "center",
    // },
    {
      title: "No",
      align: "center",
      width: "3%",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: t("ID"),
      dataIndex: "username",
      key: "username",
      width: "8%",
      align: "center",
      render: (value, record) =>
        record.user_id ? (
          <Link to={`/user/${record.user_id}`}>
            <ColorizeUsername username={value} />
          </Link>
        ) : (
          <ColorizeUsername username={value} />
        ),
    },
    {
      title: t("col.gameType"),
      dataIndex: "game_type",
      key: "game_type",
      width: "6%",
      align: "center",
      render: (value: string) => (
        <span style={{ textTransform: "uppercase", textWrap: "nowrap" }}>
          {categoryKRText[(value ?? "").toLowerCase()] || value}
        </span>
      ),
    },
    {
      title: t("col.provider"),
      dataIndex: "game_history",
      key: "game_history",
      width: "6%",
      align: "center",
      render: (value, record) => (
        <span style={{ textTransform: "uppercase" }}>
          {record.game_history === "evoslot" ? record.bet_data_2 : value}
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "match_color",
      // key: "match_color",
      align: "left",
      hidden:
        !(
          (gameCategory === "sports" || category === "sports") &&
          (pathname.startsWith("/user") || pathname.startsWith("/payment"))
        ),
      render: (colors) => (
        <MatchColorBadge
          colors={colors}
          size={16}
        />
      ),
    },
    {
      title: t("col.gameCategory"),
      dataIndex: "game_division",
      key: "game_division",
      width: "20%",
      align: "center",
      render: (value, record) => {
        if (
          record.game_history === "lotus" ||
          record.game_history === "token" ||
          record.game_history === "bti"
        )
          return value;

        if (record.game_history === "ksports") return record.bet_data;

        if (record.game_name) return record.game_name;
        if (record.game_history === "sagaming") return record.reserve_id;

        if (value.includes("IR_GameType")) {
          return (
            <div style={{ fontSize: 10, whiteSpace: "normal" }}>
              {value.match(/IR_GameType:([^:-]+)/)?.[1] ?? value}
            </div>
          );
        }

        if (value.includes("GameType") && value.includes("gameData")) {
          try {
            const {
              gameData: { GameType, GameName },
              betData,
              tableData,
            } = JSON.parse(value);
            const newBetData = betData ? parseBetData(betData) : {};

            if (record.game_history == "ag") throw new Error();
            if (record.game_history == "mg") throw new Error();
            if (record.game_history == "micro") throw new Error();
            if (record.game_history == "dg") throw new Error();
            if (record.game_history == "bota") throw new Error();
            if (
              record.game_history == "cq9" &&
              record.game_type?.toLowerCase() !== "fish"
            )
              throw new Error();
            if (
              ["slot", "fish", "arcade", "minigame"].includes(
                record.game_type?.toLowerCase() || ""
              )
            ) {
              const gameItem = GameList?.data.find(
                (item) => item.game_key === GameType
              );
              const gameItem2 = GameList?.data.find(
                (item) => item.game_key === GameName
              );
              if (gameItem) {
                return gameItem?.game_name || gameItem?.game_name_en;
              }
              if (gameItem2) {
                return (
                  gameItem2?.game_name || gameItem2?.game_name_en || GameType
                );
              }
              return GameName;
            }

            if (record.game_history === "evo") {
              console.log((newBetData as BetData)?.name, "hereeee");
              const parseEvo = parseEvoBetData(betData);
              return (
                parseEvo[1].name ||
                tableData?.name ||
                GameType?.split("-")[0] ||
                "-"
              );
            }

            return GameType;
          } catch {
            // if (record.game_type.toLowerCase() === 'slot' && record.game_history === 'ds') {
            try {
              const { gameData } = JSON.parse(value);
              // console.log("GAME DATA", gameData);
              const gameName = gameData.GameName;
              if (gameName.includes("SMG_MGLiveGrand_"))
                return gameName.replace("SMG_MGLiveGrand_", "");
              if (gameName.includes("SMG_"))
                return gameName.replace("SMG_", "");
              return gameName ?? "-";
            } catch {
              return "-";
            }
            // }
            return "-";
          }
        }

        if (
          value.includes("gameName") ||
          record.bet_data.includes("gameName")
        ) {
          try {
            const { gameName } = JSON.parse(value);
            if (gameName) return gameName;
            return "-";
          } catch (error) {
            const { gameName } = JSON.parse(record.bet_data);
            if (gameName) return gameName;
            return "-";
          }
        }

        if (record.bet_data.includes("GameName")) {
          try {
            const { gameData } = JSON.parse(record.bet_data);
            const { GameName } = gameData;
            if (GameName) return GameName;
            return "-";
          } catch (error) {
            return "-";
          }
        }

        return "-";
      },
    },
    {
      title: t("col.betType"),
      dataIndex: "betting_category",
      key: "betting_category",
      width: "6%",
      align: "center",
      render: (value, record) => {
        if (value && value !== "-") {
          return value;
        }

        if (record.game_history === "BTMT") {
          return (
            record.bet_data.includes(",")
              ? record.bet_data.split(",").map((s, i) => (
                  <div key={i}>{s.trim()}</div>
                ))
              : record.bet_data
          );
        }

        if (record.game_history === "ksports") {
          try {
            const parsed = JSON.parse(record.bet_details);
            const details = parsed?.[0]?.details;

            if (Array.isArray(details)) {
              return details.length;
            }
          } catch (error) {
            console.error("Failed to parse bet_details:", error);
          }
        }

        try {
          const {
            gameData: { GameType, GameInfo },
          } = JSON.parse(record.game_division);

          if (record.game_history === "pp") {
            return GameInfo === "R" ? i18next.t("betting.spin") : GameInfo;
          }

          if (GameType.includes("baccarat-"))
            return (
              baccResKRText[gameTypeFormatter(GameType)] ||
              gameTypeFormatter(GameType) ||
              GameType
            );
          if (GameType.includes("roulette-"))
            return gameTypeFormatter(GameType, "roulette-ROU_") || GameType;

          return GameType;
        } catch {
          return "-";
        }
      },
    },
    {
      title: t("col.betAmount"),
      dataIndex: "bet_amount",
      key: "bet_amount",
      width: "6%",
      align: "center",
      render: (value) => (
        <div className="" style={{ minWidth: 120 }}>
          <CommaNumber value={value} onlyNumber />
        </div>
      ),
    },
    {
      title: t("col.resultAmount"),
      dataIndex: "win_amount",
      key: "win_amount",
      width: "6%",
      align: "center",
      render: (value) => (
        <div className="" style={{ minWidth: 120 }}>
          <CommaNumber value={value} onlyNumber />
        </div>
      ),
    },
    {
      title: t("col.profitLoss"),
      dataIndex: "win_loss",
      key: "win_loss",
      width: "6%",
      align: "center",
      render: (value: number) => (
        <div className="" style={{ minWidth: 120 }}>
          <CommaNumber value={value} onlyNumber />
        </div>
      ),
    },
    {
      title: t("col.rolling"),
      dataIndex: "rolling_point",
      key: "rolling_point",
      width: "6%",
      align: "center",
      render: (value: number, record) => {
        if (
          ["fish", "lottery", "card", "arcade"].includes(
            record.game_type.toLowerCase()
          )
        ) {
          return "-";
        } else {
          return <CommaNumber value={value} onlyNumber />;
        }
      },
    },
    {
      title: t("col.rollingRate"),
      dataIndex: "rolling_rate",
      key: "rolling_rate",
      width: "6%",
      align: "center",
      render: (value: number) =>
        value
          ? (value * 100).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "-",
    },
    {
      title: t("col.status"),
      dataIndex: "status",
      key: "status",
      width: "6%",
      align: "center",
      render: (_, record) => (
        <div className="" style={{ textWrap: "nowrap" }}>
          {renderStatus(record)}
        </div>
      ),
    },
    {
      title: t("col.betDateTime"),
      dataIndex: "bet_date",
      key: "bet_date",
      width: "10%",
      align: "center",
      render: (_, record) => GF.cleanDateString(record.bet_date, true),
    },
    {
      title: t("col.transactionId"),
      dataIndex: "transaction_id",
      key: "transaction_id",
      align: "center",
      width: "20%",
      render: (value) => (
        <div
          style={{
            fontSize: 10,
            maxWidth: 200,
            textWrap: "pretty",
            margin: "auto",
          }}
        >
          {value}
        </div>
      ),
    },
    {
      title: t("col.details"),
      dataIndex: "bet_details",
      key: "bet_details",
      align: "center",
      width: 60,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {(record.game_type === "sports" ||
            record.game_history === "pp" ||
            record.game_history === "cq9" ||
            record.game_history === "BNG" ||
            (record.game_history === "ag" && record.game_type === "live") ||
            // (record.game_history === "evo" &&
            //   (record.bet_data.includes("baccarat") ||
            //     record.bet_data.includes("blackjack") ||
            //     record.bet_data.includes("roulette") ||
            //     record.bet_data.includes("sicbo") ||
            //     record.bet_data.includes("holdem") ||
            //     record.bet_data.includes("fantan") ||
            //     record.bet_data.includes("dragontiger") ||
            //     record.bet_data.includes("bacbo")
            //   )
            // ) ||
            record.game_history === "evo" ||
            record.game_history === "evoslot" ||
            record.game_history === "mg" ||
            record.game_history === "fc" ||
            record.game_history === "ds" ||
            record.game_history === "dg" ||
            record.game_history === "pgsoft" ||
            record.game_history === "lotus" ||
            record.game_history === "evoplay" ||
            record.game_history === "buffalo" ||
            (record.game_history === "sagaming" && record.game_type === "live" && record.bet_type.includes('bac')) ||
            record.game_history === "og") && (
            <DetailBtn
              onClick={() => {
                handleDetailOpen(record);
              }}
            />
          )}
          {CANCELLABLE_BET_TYPES.has(record.bet_type) && record.status === "PENDING" && (
            <Button
              size="small"
              onClick={() => setCancelTarget(record)}
              style={{ background: "#dc2626", borderColor: "#dc2626", color: "#fff" }}
            >
              {t("global.cancel")}
            </Button>
          )}
          {CANCELLABLE_BET_TYPES.has(record.bet_type) &&
            record.bet_type !== "special" &&
            record.status === "PENDING" && (
              <Button size="small" onClick={() => setSettleTarget(record)}>
                부분정산
              </Button>
            )}
        </div>
      ),
    },
  ];

  const matchColorMap = useMemo(
    () =>
      new Map(
        ((totals?.color_data as MatchColor[] | undefined) ?? []).map((item) => [
          item.transaction_id,
          item,
        ])
      ),
    [totals?.color_data]
  );

  const columns = columnsArray
    .map((item) =>
      item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
    )
    .filter((item) =>
      pathname.startsWith("/user") ? item.key !== "username" : Boolean
    );
  
  const filteredData = useMemo(() => {
    const shouldApply =
      (gameCategory === "sports" || category === "sports") &&
      (pathname.startsWith("/user") || pathname.startsWith("/payment"));

    if (!shouldApply) return data;

    return data
      ?.filter((item: { game_history: string }) => item.game_history !== "ksports")
      .map((item: BetLogData) => {
        const matched = matchColorMap.get(item.transaction_id);

        if (!matched) return item;

        const match_color_name = matched.match_name.map((name: string, index: number) => ({
          name,
          color: matched.match_color[index],
        }));


        return {
          ...item,
          match_color: matched.match_color,
          match_color_name
        };
      });
  }, [data, matchColorMap, gameCategory, category, pathname]);
  
  return (
    <>
      <Table
        sticky
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={(record) => `${record.id}-${record.game_type}`}
        tableLayout="auto"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
        summary={() => {
          return (
            <Table.Summary fixed="top">
              <Table.Summary.Row
                className="font-bold"
                style={{ backgroundColor: "#f0f1f7" }}
              >
                <Table.Summary.Cell
                  index={0}
                  colSpan={gameCategory === "sports" ? 5 : 4}
                ></Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  {i18next.t("col.total")}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="center">
                  <CommaNumber value={totals?.bet_amount} onlyNumber />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="center">
                  <CommaNumber value={totals?.win_amount} onlyNumber />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="center">
                  <CommaNumber value={totals?.win_loss} onlyNumber />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} colSpan={6}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
      <Modal
        open={betDetailsOpen !== undefined}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setBetDetailsOpen(undefined)}
        width={"90%"}
        style={{ margin: "1rem auto" }}
      >
        <BetDetails data={betDetailsOpen} />
      </Modal>
      <CancelBetModal
        open={!!cancelTarget}
        record={cancelTarget}
        onClose={() => setCancelTarget(undefined)}
        onCancelled={() => {
          setCancelTarget(undefined);
          mutate?.();
        }}
      />
      <SettleTicketModal
        open={!!settleTarget}
        record={settleTarget}
        onClose={() => setSettleTarget(undefined)}
        onSettled={() => mutate?.()}
      />
    </>
  );
};

export default List;
