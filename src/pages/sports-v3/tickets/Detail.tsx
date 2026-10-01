import { Button, Card, Descriptions, Divider, Space, Table, Tag } from "antd";
import i18next from "@/i18n/i18n";
import type { TableColumnsType } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "@/components/Breadcrumb";
import {
  SportsV3CashoutRecord,
  SportsV3Selection,
  useSportsV3TicketDetail,
} from "@/api/sports-v3";
import { fmtAmount, fmtDate } from "../helpers";

const SELECTION_COLUMNS: TableColumnsType<SportsV3Selection> = [
  { title: i18next.t("col.sport"), dataIndex: "sport_name", render: (v) => v ?? "-" },
  { title: i18next.t("title.matchTitle"), dataIndex: "event_name", render: (v) => v ?? "-" },
  { title: i18next.t("col.market"), dataIndex: "market_name", render: (v) => v ?? "-" },
  { title: i18next.t("title.select"), dataIndex: "odd_name", render: (v) => v ?? "-" },
  { title: i18next.t("col.odds"), dataIndex: "odd_value", render: (v) => v ?? "-" },
  { title: i18next.t("col.result"), dataIndex: "result", render: (v) => (v ? <Tag>{v}</Tag> : "-") },
];

const CASHOUT_COLUMNS: TableColumnsType<SportsV3CashoutRecord> = [
  { title: i18next.t("col.dateTime"), dataIndex: "date", render: fmtDate },
  { title: i18next.t("col.amount"), dataIndex: "amount", align: "right", render: fmtAmount },
  { title: i18next.t("title.ratioPct"), dataIndex: "percent", align: "right" },
  { title: i18next.t("title.remainingStake"), dataIndex: "stake", align: "right", render: fmtAmount },
  { title: "IP", dataIndex: "ip", render: (v) => v ?? "-" },
];

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSportsV3TicketDetail(ticketId);
  const ticket = data?.data;

  return (
    <Card loading={isLoading}>
      <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
        <Breadcrumb replace={i18next.t("sportsV3.ticketDetail")} />
        <Button size="small" onClick={() => navigate(-1)}>
          뒤로
        </Button>
      </Space>
      <Divider />

      {ticket ? (
        <>
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label={i18next.t("title.ticketId")}>{ticket.ticket_id}</Descriptions.Item>
            <Descriptions.Item label={i18next.t("global.user")}>{ticket.username ?? ticket.user_id}</Descriptions.Item>
            <Descriptions.Item label={i18next.t("col.type")}>{ticket.bet_type ?? "-"}</Descriptions.Item>
            <Descriptions.Item label={i18next.t("col.status")}>
              <Tag>{ticket.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={i18next.t("title.amountType")}>{ticket.amount_type}</Descriptions.Item>
            <Descriptions.Item label={i18next.t("title.currency")}>{ticket.currency}</Descriptions.Item>
            <Descriptions.Item label={i18next.t("title.stake")}>{fmtAmount(ticket.amount)}</Descriptions.Item>
            <Descriptions.Item label={i18next.t("sportsBet.totalOdds")}>{ticket.odds ?? "-"}</Descriptions.Item>
            <Descriptions.Item label={i18next.t("sportsV3.expectedPayout")}>
              {fmtAmount(ticket.payout ?? ticket.payout_info?.return)}
            </Descriptions.Item>
            <Descriptions.Item label={i18next.t("sportsV3.createdSettled")}>
              {fmtDate(ticket.created_at)} / {fmtDate(ticket.settled_at)}
            </Descriptions.Item>
          </Descriptions>

          {ticket.result && (
            <>
              <Divider orientation="left">{i18next.t("sportsV3.settlementResult")}</Divider>
              <Descriptions bordered size="small" column={3}>
                <Descriptions.Item label={i18next.t("title.pay")}>{fmtAmount(ticket.result.pay)}</Descriptions.Item>
                <Descriptions.Item label={i18next.t("sportsV3.resultCode")}>{fmtAmount(ticket.result.result)}</Descriptions.Item>
                <Descriptions.Item label={i18next.t("title.cashout")}>{fmtAmount(ticket.result.cashout)}</Descriptions.Item>
                <Descriptions.Item label={i18next.t("depositBonus.db003")}>{ticket.result.bonus_percent}</Descriptions.Item>
                <Descriptions.Item label={i18next.t("col.bonusAmount")}>{fmtAmount(ticket.result.bonus_amount)}</Descriptions.Item>
                <Descriptions.Item label={i18next.t("sportsV3.openAdjusted")}>
                  {String(ticket.result.open)} / {String(ticket.result.correction)}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}

          <Divider orientation="left">{i18next.t("sportsV3.selections")}</Divider>
          <Table<SportsV3Selection>
            rowKey="key"
            size="small"
            pagination={false}
            scroll={{ x: true }}
            columns={SELECTION_COLUMNS}
            dataSource={(ticket.selections ?? []).map((s, i) => ({ ...s, key: i }))}
          />

          {ticket.cashout_history && ticket.cashout_history.length > 0 && (
            <>
              <Divider orientation="left">{i18next.t("sportsV3.cashoutHistory")}</Divider>
              <Table<SportsV3CashoutRecord>
                rowKey="key"
                size="small"
                pagination={false}
                scroll={{ x: true }}
                columns={CASHOUT_COLUMNS}
                dataSource={ticket.cashout_history.map((c, i) => ({ ...c, key: i }))}
              />
            </>
          )}
        </>
      ) : (
        !isLoading && <div>{i18next.t("sportsV3.ticketNotFound")}</div>
      )}
    </Card>
  );
};

export default TicketDetail;
