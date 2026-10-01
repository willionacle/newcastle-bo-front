import { useState, useEffect } from "react";
import i18next from "@/i18n/i18n";
import {
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
import VrOptions from "@/pages/vr/VrOptions.json";
import { getVrBetHistoryViewAPI } from "@/api/vr-game/get";
import {
  updateVrBetHistoryAPI,
  updateVrBetDetailAPI,
} from "@/api/vr-game/patch";

export interface VrBetDetail {
  id: number;
  start_datetime: string;
  vr_sports_config: { sports_name: string; sports_name_kr: string };
  league_name: string;
  vr_market: { type: string };
  home_name: string;
  home_odds: number;
  draw_odds: number;
  away_name: string;
  away_odds: number;
  bet_type: number;
  result_type: number;
  status: number;
  market_type: string;
  result_1: string;
  result_2: string;
}

interface VrBettingDetailModalProps {
  isOpen?: boolean;
  close?: () => void;
  fetchList?: () => void;
  data: {
    id: number;
    username: string;
    created_at: string;
    key: string;
    status: number;
    total_odds: number;
    bonus_odds?: string;
    bet_amount: number;
    win_amount: number;
    vr_bet_details: VrBetDetail[];
  };
}

const VrBettingDetail = ({
  isOpen,
  data,
  fetchList,
}: VrBettingDetailModalProps) => {
  const [status, setStatus] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState<string | null>(null);
  const [details, setDetails] = useState<VrBetDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setStatus(data.status);
      setWinAmount(commaNumber(data.win_amount));
      setDetails(data.vr_bet_details);
    }
  }, [isOpen, data]);

  const unComma = (val: string) => val.replace(/,/g, "");

  const handleWinAmountChange = (val: string) => {
    setWinAmount(commaNumber(unComma(val)));
  };

  const updateHistory = async () => {
    setLoading(true);
    try {
      const res = await updateVrBetHistoryAPI({
        id: data.id,
        status,
        winAmount: unComma(winAmount ?? "0"),
      });
      notification[res.status === 200 ? "success" : "error"]({
        message: res.data.message,
      });

      const viewRes = await getVrBetHistoryViewAPI({ id: data.id });

      if (viewRes) {
        setStatus(viewRes.status);
        setWinAmount(commaNumber(viewRes.win_amount));
        setDetails(viewRes.vr_bet_details);
      }

      fetchList?.();
    } finally {
      setLoading(false);
    }
  };

  const updateDetail = async (id: number) => {
    const detail = details.find((x) => x.id === id);
    if (!detail) return;

    setLoading(true);
    try {
      const res = await updateVrBetDetailAPI({
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
      prev.map((item) => (item.id === id ? { ...item, status: value } : item)),
    );
  };

  const items: DescriptionsProps["items"] = [
    { label: i18next.t("col.id"), children: data.username },
    {
      label: i18next.t("sportsBet.betTime"),
      children: dayjs.utc(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
    { label: i18next.t("sportsBet.betKey"), children: data.key },
    {
      label: i18next.t("col.status"),
      children: (
        <Select
          value={status ?? undefined}
          options={VrOptions.bettingStatusOptions}
          style={{ width: 120 }}
          onChange={setStatus}
        />
      ),
    },
    {
      label: i18next.t("sportsBet.oddsBonus"),
      children: `${data.total_odds} / ${data.bonus_odds || "-"}`,
    },
    { label: i18next.t("col.betAmount"), children: commaNumber(data.bet_amount) },
    {
      label: i18next.t("sportsBet.expectedWin"),
      children: commaNumber(Math.floor(data.total_odds * data.bet_amount)),
    },
    {
      label: i18next.t("col.winningAmount"),
      children: (
        <Input
          value={winAmount ?? ""}
          onChange={(e) => handleWinAmountChange(e.target.value)}
        />
      ),
    },
    {
      label: i18next.t("sportsBet.edit"),
      children: <Button onClick={updateHistory}>{i18next.t("sportsScore.save")}</Button>,
    },
  ];

  const columns: ColumnsType<VrBetDetail> = [
    {
      title: i18next.t("sportsBet.matchTime"),
      dataIndex: "start_datetime",
      key: "start_datetime",
      align: "center",
      render: (value) => dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: i18next.t("col.sport"),
      dataIndex: "sports_name_kr",
      key: "sports_name_kr",
      align: "center",
      render: (_, record) => record.vr_sports_config.sports_name_kr,
    },
    {
      title: i18next.t("col.league"),
      dataIndex: "league_name",
      key: "league_name",
      align: "center",
    },
    {
      title: i18next.t("col.market"),
      align: "center",
      render: (_, record) => record.vr_market.type,
    },
    {
      title: i18next.t("col.home"),
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
          <span>{record.home_odds.toFixed(2)}</span>
        </div>
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
          {record.draw_odds && record.market_type === "wintielose"
            ? record.draw_odds.toFixed(2)
            : record.draw_odds
              ? record.draw_odds
              : "VS"}
        </div>
      ),
    },
    {
      title: i18next.t("col.away"),
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
          <span>{record.away_odds.toFixed(2)}</span>
          <span>{record.away_name}</span>
        </div>
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
      align: "center",
      dataIndex: "score",
      key: "score",
      render: (value) => <>{value || "-"}</>,
    },
    {
      title: i18next.t("col.status"),
      align: "center",
      render: (_, record) => (
        <Select
          value={record.status}
          size="small"
          options={VrOptions.bettingStatusOptions}
          onChange={(val) => handleDetailStatusChange(record.id, val)}
        />
      ),
    },
    {
      title: i18next.t("sportsBet.edit"),
      align: "center",
      render: (_, record) => (
        <Button onClick={() => updateDetail(record.id)} size="small">
          {i18next.t("sportsScore.save")}
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Descriptions
        bordered
        column={4}
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
  );
};

export default VrBettingDetail;
