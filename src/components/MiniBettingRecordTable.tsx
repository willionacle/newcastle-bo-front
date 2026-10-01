import { useEffect, useState } from "react";
import i18next from "@/i18n/i18n";
import { Table, Alert } from "antd";
import { getMiniBetHistoryAPI } from "@/api/mini-game/get";
import commaNumber from "comma-number";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

interface Props {
  game?: string;
  minute?: string | number;
  betTypeId?: string | number;
  status?: string | number;
  username?: string;
  round?: string;
  betKey?: string;
  dateRange?: string[];
}

const MiniBettingRecordTable = ({
  game,
  minute,
  betTypeId,
  status,
  username,
  round,
  betKey,
  dateRange,
}: Props) => {
  const [data, setData] = useState([]);
  const [totalSummary, setTotalSummary] = useState({
    betAmount: 0,
    winAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
    showSizeChanger: true,
  });

  const fetchList = async (
    page = 1,
    size = pagination.pageSize,
    sort?: string,
    order?: string
  ) => {
    try {
      setLoading(true);
      const res = await getMiniBetHistoryAPI({
        page,
        size,
        from: dayjs(dateRange?.[0]).format("YYYY-MM-DD HH:mm:ss"),
        to: dayjs(dateRange?.[1]).format("YYYY-MM-DD HH:mm:ss"),
        game,
        minute,
        betTypeId,
        status,
        username,
        round,
        key: betKey,
        sort,
        order,
      });

      setData(res.data || []);
      setTotalSummary({
        betAmount: res.total_bet_amount,
        winAmount: res.total_win_amount,
      });
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total: res.total || 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(pagination.current, pagination.pageSize);
  }, [game, minute, betTypeId, status, username, round, betKey, dateRange]);

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("col.id"),
      align: "center",
      render: (_, record) => (
        <Link to={`/user/${record.up_user.id}`}>{record.username}</Link>
      ),
    },
    {
      title: i18next.t("sportsBet.betKey"),
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: i18next.t("memberDetail.mis051"),
      align: "center",
      render: (_, record) => {
        if (record.game === "coin_powerball") {
          return <span>{i18next.t("miniCfg.coinPowerball")}{record.minute}{i18next.t("unit.min")}</span>;
        } else if (record.game === "coin_ladder") {
          return <span>{i18next.t("miniCfg.coinLadder")}{record.minute}{i18next.t("unit.min")}</span>;
        } else if (record.game === "eos_powerball") {
          return <span>{i18next.t("miniCfg.eosPowerball")}{record.minute}{i18next.t("unit.min")}</span>;
        }
      },
    },
    {
      title: i18next.t("sportsScore.round"),
      dataIndex: "date_round",
      key: "date_round",
      sorter: true,
      align: "center",
    },
    {
      title: i18next.t("title.betTypeAlt"),
      align: "center",
      render: (_, record) => <>{record.mini_bet_type.name}</>,
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: number) => {
        if (value === 0) {
          return <span>{i18next.t("global.waiting")}</span>;
        } else if (value === 1) {
          return <span style={{ color: "blue" }}>{i18next.t("sportsBet.statusHit")}</span>;
        } else if (value === 2) {
          return <span style={{ color: "red" }}>{i18next.t("sportsBet.statusMiss")}</span>;
        }
      },
    },
    {
      title: i18next.t("col.odds"),
      dataIndex: "odds",
      key: "odds",
      sorter: true,
      align: "center",
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
      title: i18next.t("sportsBet.expectedWin"),
      align: "center",
      render: (_, record) => {
        return <>{commaNumber(Math.floor(record.odds * record.bet_amount))}</>;
      },
    },
    {
      title: i18next.t("col.winningAmount"),
      dataIndex: "win_amount",
      key: "win_amount",
      sorter: true,
      align: "center",
      render: (value: number) => <>{commaNumber(value)}</>,
    },
    {
      title: i18next.t("sportsBet.profit"),
      align: "center",
      render: (_, record) => (
        <>{commaNumber(record.bet_amount - record.win_amount)}</>
      ),
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
  ];

  return (
    <>
      <Alert
        message={
          <>
            <span style={{ marginRight: 10 }}>
              베팅금액: <a>{commaNumber(totalSummary.betAmount)}원</a>
            </span>
            <span style={{ marginRight: 10 }}>
              당첨금액: <a>{commaNumber(totalSummary.winAmount)}원</a>
            </span>
            <span>
              수익:{" "}
              <a>
                {commaNumber(totalSummary.betAmount - totalSummary.winAmount)}원
              </a>
            </span>
          </>
        }
        type="info"
        style={{ marginBottom: 12, fontSize: "14px" }}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={(pagination, _filter, sorter: any) => {
          const { current = 1, pageSize = 30 } = pagination;
          const sortField = sorter.field;
          const sortOrder =
            sorter.order === "ascend"
              ? "ASC"
              : sorter.order === "descend"
              ? "DESC"
              : undefined;

          setPagination((prev) => ({
            ...prev,
            current,
            pageSize,
          }));

          fetchList(current, pageSize, sortField, sortOrder);
        }}
      />
    </>
  );
};

export default MiniBettingRecordTable;
