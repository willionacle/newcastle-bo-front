import { useEffect, useState } from "react";
import i18next from "@/i18n/i18n";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";

import Breadcrumb from "@/components/Breadcrumb";
import SearchBtn from "@/components/SearchBtn";
import {
  cancelSportsV3BonusAPI,
  issueSportsV3BonusAPI,
  SPORTS_V3_BONUS_STATUS_OPTIONS,
  SportsV3Bonus,
  SportsV3BonusTemplate,
  sportsV3BonusTemplatesAPI,
  useSportsV3Bonuses,
} from "@/api/sports-v3";
import { fmtAmount, fmtDate } from "../helpers";

/** Statuses for which a cancel action makes no sense. */
const TERMINAL_STATUS = ["complete", "close", "expire", "cancelled"];

const BONUS_TYPE_OPTIONS = [
  { label: "free_bet", value: "free_bet" },
  { label: "sport_bonus", value: "sport_bonus" },
];

/** When `username` is given the list is embedded in a member detail tab. */
const BonusList = ({ username }: { username?: string }) => {
  const { t } = useTranslation();
  const embedded = Boolean(username);
  const [form] = Form.useForm();
  const { swr, paginationProps, setFilters } = useSportsV3Bonuses(username);

  const [issueOpen, setIssueOpen] = useState(false);
  const [issueForm] = Form.useForm();
  const [templates, setTemplates] = useState<SportsV3BonusTemplate[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!issueOpen) return;
    let active = true;
    (async () => {
      try {
        const res = await sportsV3BonusTemplatesAPI();
        if (active) setTemplates(res.data ?? []);
      } catch {
        message.error(t("toast.bonus.templateLoadFailed"));
      }
    })();
    return () => {
      active = false;
    };
  }, [issueOpen]);

  const handleSearch = (values: {
    status?: { value?: string };
    type?: { value?: string };
    username?: string;
  }) => {
    setFilters((prev) => ({
      ...(prev ?? {}),
      username: username ?? (values.username || null),
      status: values.status?.value || null,
      type: values.type?.value || null,
      page: 1,
    }));
  };

  const handleTemplateChange = (bonusId: string) => {
    const tpl = templates.find((item) => item.bonus_id === bonusId);
    if (tpl?.type) issueForm.setFieldValue("bonus_type", tpl.type);
  };

  const handleIssue = async () => {
    const v = await issueForm.validateFields();
    setSubmitting(true);
    try {
      await issueSportsV3BonusAPI({
        bonus_id: v.bonus_id,
        bonus_type: v.bonus_type,
        user_id: username ?? v.user_id,
        currency: v.currency || "KRW",
        amount: Number(v.amount),
        language: "ko",
      });
      message.success(t("toast.bonus.grantSuccess"));
      setIssueOpen(false);
      issueForm.resetFields();
      swr.mutate();
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } }; errorFields?: unknown };
      if (err.errorFields) return; // antd form validation error
      message.error(err.response?.data?.message ?? t("toast.bonus.grantFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBonus = async (id: string) => {
    try {
      await cancelSportsV3BonusAPI(id);
      message.success(t("toast.bonus.cancelSuccess"));
      swr.mutate();
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message ?? t("toast.bonus.cancelFailed"));
    }
  };

  const columns: TableColumnsType<SportsV3Bonus> = [
    { title: i18next.t("title.bonusId"), dataIndex: "id" },
    { title: i18next.t("col.type"), dataIndex: "type" },
    { title: i18next.t("col.amount"), dataIndex: "amount", align: "right", render: fmtAmount },
    { title: i18next.t("title.currency"), dataIndex: "currency" },
    { title: i18next.t("col.status"), dataIndex: "status", render: (v) => <Tag>{v}</Tag> },
    { title: i18next.t("title.create"), dataIndex: "created_at", render: fmtDate },
    {
      title: i18next.t("col.manage"),
      key: "action",
      render: (_, r) =>
        TERMINAL_STATUS.includes(r.status) ? (
          <span style={{ color: "#999" }}>-</span>
        ) : (
          <Popconfirm
            title={i18next.t("title.confirmCancelBonus")}
            okText={i18next.t("global.cancel")}
            cancelText={i18next.t("sportsScore.close")}
            onConfirm={() => handleCancelBonus(r.id)}
          >
            <Button danger size="small">
              {i18next.t("global.cancel")}
            </Button>
          </Popconfirm>
        ),
    },
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
          <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
            <Breadcrumb replace={i18next.t("sportsV3.bonus")} />
            <Button type="primary" size="small" onClick={() => setIssueOpen(true)}>
              보너스 지급
            </Button>
          </Space>
          <Divider />
        </>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        initialValues={{ status: { value: "", label: i18next.t("col.all") } }}
      >
        <Row gutter={16}>
          <Col>
            <Form.Item label={i18next.t("col.status")} name="status">
              <Select
                labelInValue
                options={SPORTS_V3_BONUS_STATUS_OPTIONS}
                size="small"
                style={{ width: 160 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.type")} name="type">
              <Select
                labelInValue
                allowClear
                options={BONUS_TYPE_OPTIONS}
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
          <Col style={{ alignSelf: "center" }}>
            <SearchBtn size="small" block />
          </Col>
          {embedded && (
            <Col style={{ alignSelf: "center" }}>
              <Button type="primary" size="small" onClick={() => setIssueOpen(true)}>
                보너스 지급
              </Button>
            </Col>
          )}
        </Row>
      </Form>

      <Divider />

      <Table<SportsV3Bonus>
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        scroll={{ x: true }}
      />

      <Modal
        title={i18next.t("title.payBonus")}
        open={issueOpen}
        onOk={handleIssue}
        confirmLoading={submitting}
        onCancel={() => setIssueOpen(false)}
        okText={i18next.t("moneyType.pay")}
        cancelText={i18next.t("sportsScore.close")}
        destroyOnClose
      >
        <Form form={issueForm} layout="vertical" initialValues={{ currency: "KRW" }}>
          <Form.Item label={i18next.t("sportsV3.template")} name="bonus_id" rules={[{ required: true, message: t("validation.selectTemplate") }]}>
            <Select
              placeholder={i18next.t("sportsV3.bonusTemplate")}
              onChange={handleTemplateChange}
              options={templates.map((item) => ({
                label: `${item.name ?? item.bonus_id}${item.type ? ` (${item.type})` : ""}`,
                value: item.bonus_id,
              }))}
            />
          </Form.Item>
          <Form.Item label={i18next.t("sportsV3.bonusType")} name="bonus_type" rules={[{ required: true, message: t("validation.selectType") }]}>
            <Select options={BONUS_TYPE_OPTIONS} />
          </Form.Item>
          {!embedded && (
            <Form.Item label={i18next.t("col.userId")} name="user_id" rules={[{ required: true, message: t("validation.enterUserId") }]}>
              <Input />
            </Form.Item>
          )}
          <Form.Item label={i18next.t("title.currency")} name="currency" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label={i18next.t("col.amount")} name="amount" rules={[{ required: true, message: t("validation.enterAmount") }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BonusList;
