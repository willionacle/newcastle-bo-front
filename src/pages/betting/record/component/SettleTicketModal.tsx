import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Table, Tag, Space, Button, Descriptions, Popconfirm, notification, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import commaNumber from "comma-number";
import { BetLogData } from "@/api/betting-logs/get";
import {
  getBetLogDetailAPI,
  settleLegAPI,
  settleTicketAPI,
  ItfLeg,
  ItfTicketDetail,
} from "@/api/betting-logs/settle";

interface Props {
  open: boolean;
  record?: BetLogData;
  onClose: () => void;
  onSettled: () => void; // parent list should refetch — money may have moved
}

const legResultTag = (result: ItfLeg["result"]) => {
  switch (result) {
    case "WON":
      return <Tag color="green">승</Tag>;
    case "LOST":
      return <Tag color="red">패</Tag>;
    case "VOID":
      return <Tag>무효</Tag>;
    default:
      return <Tag color="blue">대기</Tag>;
  }
};

const ticketResultTag = (result: ItfTicketDetail["projectedResult"]) => {
  if (result === "WIN") return <Tag color="green">적중 예상</Tag>;
  if (result === "LOSE") return <Tag color="red">미적중 예상</Tag>;
  if (result === "REFUND") return <Tag>환불 예상</Tag>;
  return <Tag color="blue">미확정</Tag>;
};

const SettleTicketModal = ({ open, record, onClose, onSettled }: Props) => {
  const { t } = useTranslation();
  const [ticket, setTicket] = useState<ItfTicketDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [settlingLeg, setSettlingLeg] = useState<number | null>(null);
  const [settlingTicket, setSettlingTicket] = useState(false);

  useEffect(() => {
    if (!open || !record) {
      setTicket(null);
      return;
    }

    setLoading(true);
    getBetLogDetailAPI(record.id)
      .then((res) => {
        if (res.data.code === 0) setTicket(res.data.data);
        else notification.error({ message: res.data.message });
      })
      .catch(() => notification.error({ message: t("toast.common.loadFailed") ?? "불러오기 실패" }))
      .finally(() => setLoading(false));
  }, [open, record, t]);

  if (!record) return null;

  const settleLeg = async (legNo: number, result: "WON" | "LOST" | "VOID") => {
    setSettlingLeg(legNo);
    try {
      const res = await settleLegAPI(record.id, legNo, { result, autoSettle: true });
      if (res.data.code === 0) {
        notification.success({ message: res.data.message });
        setTicket(res.data.data.ticket);
        if (res.data.data.ticketSettled) onSettled();
      } else {
        notification.error({ message: res.data.message });
      }
    } catch {
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      setSettlingLeg(null);
    }
  };

  const settleTicket = async () => {
    if (!ticket) return;
    setSettlingTicket(true);
    try {
      const res = await settleTicketAPI(ticket.id, {});
      if (res.data.code === 0) {
        notification.success({ message: res.data.message });
        setTicket(res.data.data);
        onSettled();
      } else {
        notification.error({ message: res.data.message });
      }
    } catch {
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      setSettlingTicket(false);
    }
  };

  const columns: ColumnsType<ItfLeg> = [
    { title: "#", dataIndex: "legNo", align: "center", width: 48 },
    { title: "종목", dataIndex: "sport", align: "center" },
    {
      title: "경기",
      key: "match",
      render: (_, leg) => (
        <div>
          {leg.homeTeam} vs {leg.awayTeam}
          <div style={{ fontSize: 11, opacity: 0.7 }}>{leg.gameDatetime}</div>
        </div>
      ),
    },
    { title: "마켓", dataIndex: "marketType", align: "center" },
    {
      title: "선택",
      key: "selection",
      align: "center",
      render: (_, leg) => `${leg.selection}${leg.line !== null ? ` (${leg.line})` : ""}`,
    },
    { title: "배당", dataIndex: "odds", align: "center" },
    {
      title: "스코어",
      key: "score",
      align: "center",
      render: (_, leg) => `${leg.homeScore ?? "-"} : ${leg.awayScore ?? "-"}`,
    },
    { title: "결과(적용)", key: "result", align: "center", render: (_, leg) => legResultTag(leg.result) },
    { title: "피드결과", key: "feedResult", align: "center", render: (_, leg) => legResultTag(leg.feedResult) },
    {
      title: "수동판정",
      key: "manual",
      align: "center",
      render: (_, leg) =>
        leg.manualResult ? (
          <span>
            {legResultTag(leg.manualResult)}
            <div style={{ fontSize: 11, opacity: 0.7 }}>{leg.manualBy}</div>
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: "처리",
      key: "action",
      align: "center",
      render: (_, leg) => (
        <Space>
          <Popconfirm
            title="이 경기를 '승'으로 확정합니다. 피드 결과가 나중에 도착해도 이 판정이 우선 적용됩니다."
            onConfirm={() => settleLeg(leg.legNo, "WON")}
          >
            <Button size="small" loading={settlingLeg === leg.legNo}>
              승
            </Button>
          </Popconfirm>
          <Popconfirm
            title="이 경기를 '패'로 확정합니다 — 전체 슬립이 즉시 미적중 처리됩니다."
            onConfirm={() => settleLeg(leg.legNo, "LOST")}
          >
            <Button size="small" danger loading={settlingLeg === leg.legNo}>
              패
            </Button>
          </Popconfirm>
          <Popconfirm
            title="이 경기를 '무효'(배당 1.0)로 확정합니다."
            onConfirm={() => settleLeg(leg.legNo, "VOID")}
          >
            <Button size="small" loading={settlingLeg === leg.legNo}>
              무효
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal open={open} title="부분 정산" onCancel={onClose} footer={null} destroyOnClose width={"90%"} style={{ margin: "1rem auto" }}>
      <Spin spinning={loading}>
        {ticket && (
          <>
            <Descriptions bordered size="small" column={4} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="티켓">
                #{ticket.id} · {ticket.username}
              </Descriptions.Item>
              <Descriptions.Item label="배팅금">{commaNumber(ticket.amount)}</Descriptions.Item>
              <Descriptions.Item label="배당">{ticket.oddsTotal}</Descriptions.Item>
              <Descriptions.Item label="예상당첨금">{commaNumber(ticket.expectedAmount)}</Descriptions.Item>
              <Descriptions.Item label="미확정 폴더" span={2}>
                {ticket.undecidedLegs}건
              </Descriptions.Item>
              <Descriptions.Item label="정산 예상 결과">{ticketResultTag(ticket.projectedResult)}</Descriptions.Item>
              <Descriptions.Item label="정산 예상 지급액">
                {ticket.projectedPayout !== null ? commaNumber(ticket.projectedPayout) : "-"}
              </Descriptions.Item>
            </Descriptions>

            <Table<ItfLeg>
              rowKey="legNo"
              size="small"
              columns={columns}
              dataSource={ticket.legs}
              pagination={false}
              scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
            />

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Popconfirm
                title="이 슬립을 최종 정산합니다. 금액이 즉시 지급/차감됩니다."
                onConfirm={settleTicket}
                disabled={!ticket.settleable}
              >
                <Button type="primary" disabled={!ticket.settleable} loading={settlingTicket}>
                  전체 정산{ticket.projectedPayout !== null ? ` (${commaNumber(ticket.projectedPayout)})` : ""}
                </Button>
              </Popconfirm>
            </div>
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default SettleTicketModal;
