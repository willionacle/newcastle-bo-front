import { Card, Col, Divider, Form, Input, Row, Select, Space, Table, Tag } from "antd";
import i18next from "@/i18n/i18n";
import type { TableColumnsType } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Breadcrumb from "@/components/Breadcrumb";
import DateRange from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import {
  SPORTS_V3_TICKET_STATUS_OPTIONS,
  SportsV3Ticket,
  useSportsV3Tickets,
} from "@/api/sports-v3";
import { fmtAmount, fmtDate } from "../helpers";

const STATUS_COLOR: Record<string, string> = {
  pending: "gold",
  accepted: "blue",
  rejected: "red",
  cancelled: "default",
  settled: "green",
  cashout: "purple",
};

/** When `username` is given the list is embedded in a member detail tab. */
const TicketsList = ({ username }: { username?: string }) => {
  const embedded = Boolean(username);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { swr, paginationProps, setFilters } = useSportsV3Tickets(username);

  const handleSubmit = (values: {
    dateRange?: [dayjs.Dayjs | null, dayjs.Dayjs | null];
    status?: { value?: string };
    username?: string;
    ticket_id?: string;
  }) => {
    const start = values.dateRange?.[0] ?? null;
    const end = values.dateRange?.[1] ?? null;
    setFilters((prev) => ({
      ...(prev ?? {}),
      username: username ?? (values.username || null),
      ticket_id: values.ticket_id || null,
      status: values.status?.value || null,
      start_date: start ? start.format("YYYY-MM-DD HH:mm:ss") : null,
      end_date: end ? end.format("YYYY-MM-DD HH:mm:ss") : null,
      page: 1,
    }));
  };

  const columns: TableColumnsType<SportsV3Ticket> = [
    { title: i18next.t("title.ticketId"), dataIndex: "ticket_id", key: "ticket_id" },
    { title: i18next.t("col.type"), dataIndex: "bet_type", key: "bet_type", render: (v) => v ?? "-" },
    { title: i18next.t("title.amountType"), dataIndex: "amount_type", key: "amount_type" },
    { title: i18next.t("title.stake"), dataIndex: "amount", key: "amount", align: "right", render: fmtAmount },
    { title: i18next.t("col.odds"), dataIndex: "odds", key: "odds", align: "right", render: (v) => v ?? "-" },
    { title: i18next.t("title.payoutAmountTitle"), dataIndex: "payout", key: "payout", align: "right", render: fmtAmount },
    {
      title: i18next.t("col.status"),
      dataIndex: "status",
      key: "status",
      render: (v) => <Tag color={STATUS_COLOR[v] ?? "default"}>{v}</Tag>,
    },
    { title: i18next.t("title.create"), dataIndex: "created_at", key: "created_at", render: fmtDate },
  ];
  if (!embedded) {
    columns.splice(1, 0, {
      title: i18next.t("global.user"),
      dataIndex: "username",
      key: "username",
      render: (v, r) => v ?? r.user_id,
    });
  }

  return (
    <Card>
      {!embedded && (
        <>
          <Space align="center">
            <Breadcrumb replace={i18next.t("sportsV3.betTicket")} />
          </Space>
          <Divider />
        </>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: { value: "", label: i18next.t("col.all") } }}
      >
        <Row gutter={16}>
          <Col>
            <DateRange showTime label={i18next.t("event.period")} />
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.status")} name="status">
              <Select
                labelInValue
                options={SPORTS_V3_TICKET_STATUS_OPTIONS}
                size="small"
                style={{ width: 160 }}
              />
            </Form.Item>
          </Col>
          {!embedded && (
            <Col>
              <Form.Item label={i18next.t("col.userId")} name="username">
                <Input size="small" />
              </Form.Item>
            </Col>
          )}
          <Col>
            <Form.Item label={i18next.t("sportsV3.ticketId")} name="ticket_id">
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col style={{ alignSelf: "center" }}>
            <SearchBtn size="small" block />
          </Col>
        </Row>
      </Form>

      <Divider />

      <Table<SportsV3Ticket>
        rowKey="ticket_id"
        size="small"
        columns={columns}
        dataSource={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        scroll={{ x: true }}
        onRow={(record) => ({
          onClick: () => navigate(`/sports-v3/tickets/${record.ticket_id}`),
          style: { cursor: "pointer" },
        })}
      />
    </Card>
  );
};

export default TicketsList;
