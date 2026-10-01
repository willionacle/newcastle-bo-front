import { useState } from "react";
import { Form, Space, Table, TableProps, Typography, message } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import DateRange, { DateRangeType } from "@/components/DateRange";
import {
  RetentionBucket,
  RetentionType,
  useDepositRetentionStats,
} from "@/api/dashboard/deposit-retention";
import RetentionBucketModal from "./RetentionBucketModal";

const { Text } = Typography;

export interface ModalState {
  type: RetentionType;
  bucketKey: string;
  bucketLabel: string;
  sectionLabel: string;
  startDate: string;
  endDate: string;
}

/** Backend refuses ranges longer than this. */
const MAX_RANGE_DAYS = 366;
const FIRST_COL_WIDTH = 170;
const BUCKET_COL_WIDTH = 100;

const LABEL_COLORS: Record<RetentionType, string> = {
  frequency: "#eef9eb",
  days: "#ffffdb",
  non_deposit_days: "#ffebe0",
};

interface RowRecord {
  key: "combined";
  rowLabel: string;
}

interface BlockProps {
  type: RetentionType;
  label: string;
  buckets: RetentionBucket[];
  onClickCount: (state: ModalState) => void;
  startDate: string;
  endDate: string;
  loading?: boolean;
}

const RetentionBlock = ({ type, label, buckets, onClickCount, startDate, endDate, loading }: BlockProps) => {
  const { t } = useTranslation();
  const color = LABEL_COLORS[type];

  const dataSource: RowRecord[] = [
    { key: "combined", rowLabel: t("depositRetention.userCountRatio", "유저수(비중)") },
  ];

  const columns: TableProps<RowRecord>["columns"] = [
    {
      title: label,
      dataIndex: "rowLabel",
      key: "rowLabel",
      align: "center",
      width: FIRST_COL_WIDTH,
      onHeaderCell: () => ({
        style: { background: color, fontWeight: 700, color: "#333" },
      }),
      render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span>,
    },
    ...buckets.map((b) => ({
      title: b.label,
      dataIndex: b.bucket_key,
      key: b.bucket_key,
      align: "center" as const,
      render: () =>
        b.user_count > 0 ? (
          <span
            style={{ cursor: "pointer" }}
            title={t("depositRetention.clickToViewUsers", "클릭하여 유저 목록 보기")}
            onClick={() =>
              onClickCount({
                type,
                bucketKey: b.bucket_key,
                bucketLabel: b.label,
                sectionLabel: label,
                startDate,
                endDate,
              })
            }
          >
            <span style={{ color: "#e84040", fontWeight: 700, textDecoration: "underline" }}>
              {b.user_count.toLocaleString()}
            </span>{" "}
            <span style={{ color: "#1677ff", fontSize: 12 }}>({b.ratio}%)</span>
          </span>
        ) : (
          <span>
            0 <span style={{ color: "#1677ff", fontSize: 12 }}>({b.ratio}%)</span>
          </span>
        ),
    })),
  ];

  return (
    <Table
      rowKey="key"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      loading={loading}
      bordered
      size="small"
      scroll={{ x: FIRST_COL_WIDTH + buckets.length * BUCKET_COL_WIDTH }}
      tableLayout="fixed"
    />
  );
};

interface FormValues {
  dateRange: DateRangeType;
}

const DepositRetentionStats = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormValues>();

  const [defaultStart] = useState(() => dayjs().subtract(29, "day"));
  const [defaultEnd] = useState(() => dayjs());

  const [startDate, setStartDate] = useState(defaultStart.format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(defaultEnd.format("YYYY-MM-DD"));
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const { data, isLoading } = useDepositRetentionStats(startDate, endDate);

  const handleValuesChange = (_: Partial<FormValues>, all: FormValues) => {
    const range = all.dateRange;
    if (!range || !range[0] || !range[1]) return;
    const start = dayjs(range[0]).startOf("day");
    const end = dayjs(range[1]).startOf("day");
    if (end.diff(start, "day") + 1 > MAX_RANGE_DAYS) {
      message.warning(
        t("depositRetention.rangeTooLong", "조회 기간은 최대 {{days}}일까지 가능합니다.", {
          days: MAX_RANGE_DAYS,
        })
      );
      // Revert the picker to the range that is actually displayed.
      form.setFieldValue("dateRange", [dayjs(startDate), dayjs(endDate)]);
      return;
    }
    setStartDate(start.format("YYYY-MM-DD"));
    setEndDate(end.format("YYYY-MM-DD"));
  };

  const blocks: BlockProps[] = [
    {
      type: "frequency",
      label: t("depositRetention.depositFrequency", "입금횟수"),
      buckets: data.frequency_buckets,
      onClickCount: setModalState,
      startDate,
      endDate,
      loading: isLoading,
    },
    {
      type: "days",
      label: t("depositRetention.depositDays", "입금일수"),
      buckets: data.days_buckets,
      onClickCount: setModalState,
      startDate,
      endDate,
      loading: isLoading,
    },
    {
      type: "non_deposit_days",
      label: t("depositRetention.nonDepositDays", "미입금일수"),
      buckets: data.non_deposit_days_buckets,
      onClickCount: setModalState,
      startDate,
      endDate,
      loading: isLoading,
    },
  ];

  return (
    <div>
      <Form form={form} layout="inline" onValuesChange={handleValuesChange}>
        <Space size={24} align="center" wrap style={{ marginBottom: 16 }}>
          <DateRange initialValue={[defaultStart, defaultEnd]} label="depositRetention.period" />
          <Form.Item>
            <Space size={8}>
              <Text strong>{t("depositRetention.totalDepositUsers", "총 입금유저수")}</Text>
              <Text style={{ fontSize: 15, fontWeight: 700 }}>
                {data.total_deposit_users.toLocaleString()}
              </Text>
            </Space>
          </Form.Item>
        </Space>
      </Form>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {blocks.map((b) => (
          <RetentionBlock key={b.type} {...b} />
        ))}
      </div>

      {modalState && (
        <RetentionBucketModal modalState={modalState} onClose={() => setModalState(null)} />
      )}
    </div>
  );
};

export default DepositRetentionStats;
