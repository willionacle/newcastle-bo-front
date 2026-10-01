import { Card, Col, Divider, Form, Input, Row, Select, Space, Table, Tag } from "antd";
import i18next from "@/i18n/i18n";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";

import Breadcrumb from "@/components/Breadcrumb";
import DateRange from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { SportsV3Settlement, useSportsV3Settlements } from "@/api/sports-v3";
import { fmtAmount, fmtDate } from "../helpers";

const TYPE_OPTIONS = [
  { label: i18next.t("col.all"), value: "" },
  { label: i18next.t("sportsV3.settlementResultCode"), value: "result" },
  { label: i18next.t("sportsV3.statusCashout"), value: "cashout" },
];

/** When `username` is given the list is embedded in a member detail tab. */
const SettlementsList = ({ username }: { username?: string }) => {
  const embedded = Boolean(username);
  const [form] = Form.useForm();
  const { swr, paginationProps, setFilters } = useSportsV3Settlements(username);

  const handleSubmit = (values: {
    dateRange?: [dayjs.Dayjs | null, dayjs.Dayjs | null];
    type?: { value?: string };
    username?: string;
    ticket_id?: string;
  }) => {
    const start = values.dateRange?.[0] ?? null;
    const end = values.dateRange?.[1] ?? null;
    setFilters((prev) => ({
      ...(prev ?? {}),
      username: username ?? (values.username || null),
      ticket_id: values.ticket_id || null,
      type: values.type?.value || null,
      start_date: start ? start.format("YYYY-MM-DD HH:mm:ss") : null,
      end_date: end ? end.format("YYYY-MM-DD HH:mm:ss") : null,
      page: 1,
    }));
  };

  const columns: TableColumnsType<SportsV3Settlement> = [
    { title: i18next.t("title.ticketId"), dataIndex: "ticket_id" },
    {
      title: i18next.t("col.category"),
      dataIndex: "type",
      render: (v) => <Tag color={v === "cashout" ? "purple" : "green"}>{v}</Tag>,
    },
    { title: i18next.t("title.amountType"), dataIndex: "amount_type" },
    { title: i18next.t("title.pay"), dataIndex: "pay", align: "right", render: fmtAmount },
    { title: i18next.t("col.result"), dataIndex: "result", align: "right", render: fmtAmount },
    { title: i18next.t("title.cashout"), dataIndex: "cashout", align: "right", render: fmtAmount },
    { title: i18next.t("col.dateTime"), dataIndex: "created_at", render: fmtDate },
  ];
  if (!embedded) {
    columns.splice(1, 0, {
      title: i18next.t("global.user"),
      dataIndex: "username",
      render: (v, r) => v ?? r.user_id,
    });
  }

  return (
    <Card>
      {!embedded && (
        <>
          <Space align="center">
            <Breadcrumb replace={i18next.t("sportsV3.settlementCashout")} />
          </Space>
          <Divider />
        </>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: { value: "", label: i18next.t("col.all") } }}
      >
        <Row gutter={16}>
          <Col>
            <DateRange showTime label={i18next.t("event.period")} />
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.category")} name="type">
              <Select labelInValue options={TYPE_OPTIONS} size="small" style={{ width: 160 }} />
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

      <Table<SportsV3Settlement>
        rowKey={(r) => `${r.ticket_id}-${r.type}-${r.created_at ?? ""}`}
        size="small"
        columns={columns}
        dataSource={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default SettlementsList;
