import { useState } from "react";
import { Alert, Button, Card, DatePicker, Descriptions, Divider, notification, Popconfirm, Space, Table, TableProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import NewColorizeUsername from "@/components/NewColorizeUsername";
import {
  previewReferralRewards,
  runReferralRewards,
  ReferralRewardItem,
  ReferralRewardsRunData,
} from "@/api/referral-rewards/post";

const { RangePicker } = DatePicker;

const formatAmount = (value: number | undefined | null) =>
  (value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const defaultRange = (): [Dayjs, Dayjs] => {
  const lastMonth = dayjs().subtract(1, "month");
  return [lastMonth.startOf("month"), lastMonth.endOf("month")];
};

const ReferralPayout = () => {
  const { t } = useTranslation();
  const [range, setRange] = useState<[Dayjs, Dayjs]>(defaultRange());
  const [previewing, setPreviewing] = useState(false);
  const [running, setRunning] = useState(false);
  const [preview, setPreview] = useState<ReferralRewardsRunData | null>(null);
  const [result, setResult] = useState<ReferralRewardsRunData | null>(null);

  const from = range[0].format("YYYY-MM-DD");
  const to = range[1].format("YYYY-MM-DD");
  const busy = previewing || running;

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setRange([dates[0], dates[1]]);
    }
    setPreview(null);
    setResult(null);
  };

  const handlePreview = async () => {
    setPreviewing(true);
    setResult(null);
    setPreview(null);

    try {
      const res = await previewReferralRewards(from, to);

      if (res.code === 0) {
        setPreview(res.data);
        if (!res.data.planned) {
          notification.info({ message: t("toast.referralPayout.nothingToPay") });
        }
      } else {
        notification.error({ message: res.message || t("toast.referralPayout.previewFailed") });
      }
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: error.response?.data?.message || t("toast.referralPayout.previewFailed"),
      });
    } finally {
      setPreviewing(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);

    try {
      const res = await runReferralRewards(from, to);

      if (res.code === 0) {
        setResult(res.data);
        setPreview(null);
        notification.success({ message: t("toast.referralPayout.runSuccess") });
      } else {
        notification.error({ message: res.message || t("toast.referralPayout.runFailed") });
      }
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: error.response?.data?.message || t("toast.referralPayout.runFailed"),
      });
    } finally {
      setRunning(false);
    }
  };

  const itemColumns: TableProps<ReferralRewardItem>["columns"] = [
    {
      title: t("referralPayout.kind"),
      dataIndex: "kind",
      key: "kind",
      align: "center",
      render: (value: string) =>
        value === "ROLLING" ? t("referralPayout.kindRolling") : t("referralPayout.kindProfit"),
    },
    {
      title: t("referralCfg.referrerId"),
      dataIndex: "referrer",
      key: "referrer",
      align: "center",
      render: (value: string) => <NewColorizeUsername value={value} />,
    },
    {
      title: t("referralPayout.referee"),
      dataIndex: "referee",
      key: "referee",
      align: "center",
      render: (value: string) => <NewColorizeUsername value={value} />,
    },
    {
      title: t("referralPayout.statDate"),
      dataIndex: "statDate",
      key: "statDate",
      align: "center",
    },
    {
      title: t("referralPayout.basis"),
      dataIndex: "basis",
      key: "basis",
      align: "right",
      render: (value: number) => formatAmount(value),
    },
    {
      title: t("referralPayout.amount"),
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (value: number) => formatAmount(value),
    },
  ];

  return (
    <Card>
      <Breadcrumb />
      <Divider />

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Alert type="info" showIcon message={t("referralPayout.noAutoRunNotice")} />

        <Space align="end" size="middle" wrap>
          <div>
            <div style={{ marginBottom: 4 }}>{t("referralPayout.period")}</div>
            <RangePicker
              value={range}
              onChange={handleRangeChange}
              allowClear={false}
              disabled={busy}
            />
          </div>
          <Button type="primary" onClick={handlePreview} loading={previewing} disabled={running}>
            {t("referralPayout.previewBtn")}
          </Button>
        </Space>

        {preview && (
          <Card size="small" title={t("referralPayout.previewTitle")}>
            <Descriptions column={4} size="small" bordered>
              <Descriptions.Item label={t("referralPayout.refereeDays")}>
                {preview.refereeDays.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t("referralPayout.planned")}>
                {preview.planned.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t("referralPayout.plannedAmount")}>
                {formatAmount(preview.plannedAmount)}
              </Descriptions.Item>
              <Descriptions.Item label={t("referralPayout.skippedAlreadyPaid")}>
                {preview.skippedAlreadyPaid.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {preview.itemsTruncated && (
              <Alert
                style={{ marginTop: 12 }}
                type="warning"
                showIcon
                message={t("referralPayout.itemsTruncated")}
              />
            )}

            <Table<ReferralRewardItem>
              style={{ marginTop: 12 }}
              size="small"
              rowKey={(record, index) => `${record.referrer}-${record.referee}-${record.statDate}-${record.kind}-${index}`}
              dataSource={preview.items ?? []}
              columns={itemColumns}
              pagination={{ pageSize: 20 }}
              scroll={{ x: true }}
            />

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Popconfirm
                title={t("referralPayout.confirmRunTitle")}
                description={t("referralPayout.confirmRunDesc", {
                  amount: formatAmount(preview.plannedAmount),
                  count: preview.planned,
                })}
                onConfirm={handleRun}
                okText={t("global.confirm")}
                cancelText={t("global.cancel")}
                disabled={!preview.planned}
              >
                <Button type="primary" danger loading={running} disabled={!preview.planned}>
                  {t("referralPayout.runBtn")}
                </Button>
              </Popconfirm>
            </div>
          </Card>
        )}

        {result && (
          <Card size="small" title={t("referralPayout.resultTitle")}>
            {result.failed > 0 && (
              <Alert
                style={{ marginBottom: 12 }}
                type="error"
                showIcon
                message={t("referralPayout.failedWarning", { failed: result.failed })}
              />
            )}
            <Descriptions column={3} size="small" bordered>
              <Descriptions.Item label={t("referralPayout.granted")}>
                {result.granted.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t("referralPayout.grantedAmount")}>
                {formatAmount(result.grantedAmount)}
              </Descriptions.Item>
              <Descriptions.Item label={t("referralPayout.skippedAlreadyPaid")}>
                {result.skippedAlreadyPaid.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default ReferralPayout;
