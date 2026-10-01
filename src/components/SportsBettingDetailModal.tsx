import { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Input,
  Select,
  Descriptions,
  notification,
  Spin,
  Button,
} from "antd";
import type { DescriptionsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import commaNumber from "comma-number";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import SportsOptions from "@/pages/sports/SportsOptions.json";
import { getSportsBetHistoryViewAPI } from "@/api/sports-list/get";
import {
  updateSportsBetHistoryAPI,
  updateSportsBetDetailAPI,
} from "@/api/sports-list/patch";

interface SportsBetDetail {
  id: number;
  start_datetime: string;
  sports_name_kr: string;
  league_name: string;
  sports_market: { name: string };
  home_name: string;
  home_odds: number;
  draw_odds?: number;
  odds_line?: string;
  away_name: string;
  away_odds: number;
  bet_type: number;
  result_type: number;
  status: number;
  score: string;
}

interface SportsBettingDetailModalProps {
  isOpen: boolean;
  close: () => void;
  fetchList: () => void;
  data: {
    id: number;
    username: string;
    created_at: string;
    game_type: string;
    key: string;
    status: number;
    total_odds: number;
    bonus_odds?: string;
    bet_amount: number;
    win_amount: number;
    sports_bet_details: SportsBetDetail[];
  };
}

const SportsBettingDetailModal = ({
  isOpen,
  close,
  data,
  fetchList,
}: SportsBettingDetailModalProps) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState<string | null>(null);
  const [details, setDetails] = useState<SportsBetDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setStatus(data.status);
      setWinAmount(commaNumber(data.win_amount));
      setDetails(data.sports_bet_details);
    }
  }, [isOpen, data]);

  const unComma = (val: string) => val.replace(/,/g, "");

  const handleWinAmountChange = (val: string) => {
    setWinAmount(commaNumber(unComma(val)));
  };

  const updateHistory = async () => {
    setLoading(true);
    try {
      const res = await updateSportsBetHistoryAPI({
        id: data.id,
        status,
        winAmount: unComma(winAmount ?? "0"),
      });
      notification[res.status === 200 ? "success" : "error"]({
        message: res.data.message,
      });

      const viewRes = await getSportsBetHistoryViewAPI({ id: data.id });

      if (viewRes) {
        setStatus(viewRes.status);
        setWinAmount(commaNumber(viewRes.win_amount));
        setDetails(viewRes.sports_bet_details);
      }

      fetchList();
    } finally {
      setLoading(false);
    }
  };

  const updateDetail = async (id: number) => {
    const detail = details.find((x) => x.id === id);
    if (!detail) return;

    setLoading(true);
    try {
      const res = await updateSportsBetDetailAPI({
        id,
        status: detail.status,
      });
      notification[res.status === 200 ? "success" : "error"]({
        message: res.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDetailStatusChange = (id: number, value: number) => {
    setDetails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: value } : item))
    );
  };

  const items: DescriptionsProps["items"] = [
    { label: t("sportsBet.id"), children: data.username },
    {
      label: t("sportsBet.betTime"),
      children: dayjs.utc(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
    { label: t("sportsBet.gameType"), children: data.game_type },
    { label: t("sportsBet.betKey"), children: data.key },
    {
      label: t("sportsBet.status"),
      children: (
        <Select
          value={status ?? undefined}
          options={SportsOptions.bettingStatusOptions}
          style={{ width: 120 }}
          onChange={setStatus}
        />
      ),
    },
    {
      label: t("sportsBet.oddsBonus"),
      children: `${data.total_odds} / ${data.bonus_odds || "-"}`,
    },
    { label: t("sportsBet.betAmount"), children: commaNumber(data.bet_amount) },
    {
      label: t("sportsBet.expectedWin"),
      children: commaNumber(Math.floor(data.total_odds * data.bet_amount)),
    },
    {
      label: t("sportsBet.winAmount"),
      children: (
        <Input
          value={winAmount ?? ""}
          onChange={(e) => handleWinAmountChange(e.target.value)}
        />
      ),
    },
    {
      label: t("sportsBet.edit"),
      children: <Button onClick={updateHistory}>{t("sportsBet.editBtn")}</Button>,
    },
  ];

  const columns: ColumnsType<SportsBetDetail> = [
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
            border: record.result_type === 1 ? "2px solid #1890ff" : "",
            padding: "8px",
          }}
        >
          <span>{record.home_name}</span>
          <span>{record.home_odds}</span>
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
            border: record.result_type === 2 ? "2px solid #1890ff" : "",
            padding: "8px",
          }}
        >
          {record.draw_odds || record.odds_line || "VS"}
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
            border: record.result_type === 0 ? "2px solid #1890ff" : "",
            padding: "8px",
          }}
        >
          <span>{record.away_odds}</span>
          <span>{record.away_name}</span>
        </div>
      ),
    },
    {
      title: t("sportsBet.bet"),
      dataIndex: "bet_type",
      key: "bet_type",
      align: "center",
      render: (value) => [t("sportsBet.lose"), t("sportsBet.win"), t("sportsBet.draw")][value] || "",
    },
    {
      title: t("sportsBet.result"),
      dataIndex: "result_type",
      key: "result_type",
      align: "center",
      render: (value) => [t("sportsBet.lose"), t("sportsBet.win"), t("sportsBet.draw")][value] || "-",
    },
    {
      title: t("sportsBet.score"),
      dataIndex: "score",
      key: "score",
      align: "center",
      render: (value) => <>{value || "-"}</>,
    },
    {
      title: t("sportsBet.status"),
      align: "center",
      render: (_, record) => (
        <Select
          value={record.status}
          size="small"
          options={SportsOptions.bettingDetailStatusOptions}
          onChange={(val) => handleDetailStatusChange(record.id, val)}
        />
      ),
    },
    {
      title: t("sportsBet.edit"),
      align: "center",
      render: (_, record) => (
        <Button onClick={() => updateDetail(record.id)} size="small">{t("sportsBet.editBtn")}</Button>
      ),
    },
  ];

  return (
    <Modal
      title={t("sportsBet.detailTitleSports")}
      open={isOpen}
      onCancel={close}
      width={1200}
      footer={null}
    >
      <Spin spinning={loading}>
        <Descriptions
          bordered
          column={5}
          layout="vertical"
          items={items}
          style={{ marginBottom: 12 }}
        />
        <Table
          rowKey="id"
          columns={columns}
          size="large"
          dataSource={details}
          pagination={false}
          bordered
        />
      </Spin>
    </Modal>
  );
};

export default SportsBettingDetailModal;
