import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import commaNumber from "comma-number";
import { getSportsBetHistoryAPI } from "@/api/sports-list/get";
import SportsBettingDetailModal from "./SportsBettingDetailModal";

interface Props {
  isOpen: boolean;
  close: () => void;
  data: any;
}

const SportsScoreUpdatePreviewModal = ({ isOpen, close, data }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isOpenHistory, setIsOpenHisotry] = useState(false);
  const [historyData, setHistoryData] = useState<any>([]);

  const getStatusKr = (val: number) => {
    if (val === 0) return t("global.waiting");
    else if (val === 1) return t("sportsBet.statusHit");
    else if (val === 2) return t("sportsBet.statusMiss");
    else if (val === 3) return t("sportsBet.statusSpecial");
  };

  const columns: ColumnsType<any> = [
    {
      title: t("sportsBet.id"),
      align: "center",
      render: (_, record) => (
        <Link to={`/user/${record.sports_bet_history.up_user.id}`}>
          {record.sports_bet_history.username}
        </Link>
      ),
    },
    {
      title: t("sportsBet.matchTime"),
      dataIndex: "start_datetime",
      key: "start_datetime",
      align: "center",
      render: (value) => dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: t("sportsBet.sport"),
      dataIndex: "sports_name_kr",
      key: "sports_name_kr",
      align: "center",
    },
    {
      title: t("sportsBet.league"),
      dataIndex: "league_name",
      key: "league_name",
      align: "center",
    },
    {
      title: t("sportsBet.market"),
      align: "center",
      render: (_, record) => record.sports_market.name,
    },
    {
      title: t("sportsBet.home"),
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: record.bet_type === 1 ? "#e6f7ff" : "transparent",
            border:
              record.result_type === 1
                ? "2px solid #1890ff"
                : record.update_result_type === 1
                ? "2px solid #ff9600"
                : "",
            padding: "8px",
          }}
        >
          <span>{record.home_name}</span>
          <span>{Number(record.home_odds || "0").toFixed(2)}</span>
        </div>
      ),
    },
    {
      title: t("sportsBet.draw"),
      align: "center",
      render: (_, record) => (
        <div
          style={{
            backgroundColor: record.bet_type === 2 ? "#e6f7ff" : "transparent",
            border:
              record.result_type === 2
                ? "2px solid #1890ff"
                : record.update_result_type === 2
                ? "2px solid #ff9600"
                : "",
            padding: "8px",
          }}
        >
          {record.draw_odds?.toFixed(2) || record.odds_line || "VS"}
        </div>
      ),
    },
    {
      title: t("sportsBet.away"),
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: record.bet_type === 0 ? "#e6f7ff" : "transparent",
            border:
              record.result_type === 0
                ? "2px solid #1890ff"
                : record.update_result_type === 0
                ? "2px solid #ff9600"
                : "",
            padding: "8px",
          }}
        >
          <span>{Number(record.away_odds || "0").toFixed(2)}</span>
          <span>{record.away_name}</span>
        </div>
      ),
    },
    {
      title: t("sportsBet.status"),
      align: "center",
      render: (_, record) => (
        <div>
          <span
            style={{
              color:
                record.status === 1
                  ? "blue"
                  : record.status === 2
                  ? "red"
                  : record.status === 3
                  ? "orange"
                  : "",
            }}
          >
            {getStatusKr(record.status)}
          </span>{" "}
          =&gt;{" "}
          <span
            style={{
              color:
                record.update_status === 1
                  ? "blue"
                  : record.update_status === 2
                  ? "red"
                  : record.update_status === 3
                  ? "orange"
                  : "",
            }}
          >
            {getStatusKr(record.update_status)}
          </span>
        </div>
      ),
    },
    {
      title: t("sportsBet.betAmount"),
      align: "center",
      render: (_, record) => (
        <a onClick={() => openHistory(record.sports_bet_history.key)}>
          {commaNumber(record.sports_bet_history.bet_amount)}
        </a>
      ),
    },
    {
      title: t("sportsBet.winAmount"),
      align: "center",
      render: (_, record) => {
        const winAmount = record.sports_bet_history.win_amount;
        const updateWinAmount = record.sports_bet_history.update_win_amount;
        return (
          <div
            style={{
              color: winAmount > updateWinAmount ? "blue" : "red",
            }}
          >
            <span>{commaNumber(winAmount || 0)}</span>
            {updateWinAmount && (
              <>
                {" "}
                =&gt; <span>{commaNumber(updateWinAmount)}</span>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const openHistory = async (key: string) => {
    try {
      setLoading(true);
      const res = await getSportsBetHistoryAPI({
        key: key,
      });

      if (res) {
        setHistoryData(res.data[0]);
        setIsOpenHisotry(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const closeHistory = () => {
    setIsOpenHisotry(false);
  };

  return (
    <Modal
      title={t("sportsBet.scoreChangeTitle")}
      open={isOpen}
      onCancel={close}
      width={1200}
      footer={null}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
        bordered
      />
      <SportsBettingDetailModal
        isOpen={isOpenHistory}
        close={closeHistory}
        data={historyData}
        fetchList={() => {}}
      />
    </Modal>
  );
};

export default SportsScoreUpdatePreviewModal;
