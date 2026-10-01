import dayjs from "dayjs";
import { Empty, Spin, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import {
  BettingGradeChartData,
  BettingGradeDailyAverage,
  getBettingGradeDailyTable,
} from "@/api/dashboard/get";
import CommaNumber from "@/components/CommaNumber";
import { GRADE_FIELDS, gradeRowDate } from "@/components/GradeUserDailyTable";

type AvgKey = Exclude<keyof BettingGradeDailyAverage, "month_date">;
type DailyKey =
  | "black_diamond"
  | "diamond"
  | "ruby"
  | "emerald"
  | "gold"
  | "silver"
  | "bronze"
  | "total_user";

interface GradeRow {
  key: string;
  labelKey: string;
  dailyKey: DailyKey;
  avgKey: AvgKey;
  isTotal?: boolean;
}

const GRADE_ROWS: GradeRow[] = [
  ...GRADE_FIELDS.map(({ key, labelKey, avgKey }) => ({ key, labelKey, dailyKey: key, avgKey })),
  { key: "total", labelKey: "global.sum", dailyKey: "total_user", avgKey: "avg_total_user", isTotal: true },
];

const cellPadding = "2px 8px";
const cellFontSize = "12px";
const cellLineHeight = "16px";

const headerCellStyle = {
  backgroundColor: "color-mix(in srgb, var(--ant-color-primary), transparent 80%)",
  color: "color-mix(in srgb, var(--ant-color-primary), black 5%)",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  padding: cellPadding,
  fontSize: cellFontSize,
  lineHeight: cellLineHeight,
};

const bodyCellStyle = {
  padding: cellPadding,
  fontSize: cellFontSize,
  lineHeight: cellLineHeight,
};

const totalCellStyle = {
  ...bodyCellStyle,
  backgroundColor: "color-mix(in srgb, var(--ant-color-primary), transparent 95%)",
  color: "color-mix(in srgb, var(--ant-color-primary), black 5%)",
  fontWeight: "bold" as const,
};

/**
 * Betting users by grade: today's count + the average for the current and previous month.
 * Uses the *_with_bet fields (users who actually bet). Shown in the header screenshot modal.
 */
const GradeUserMonthlyTable = () => {
  const { t } = useTranslation();
  const { data: chartData, isLoading } = getBettingGradeDailyTable();

  // One aggregate entry per month; newest first, keep current + previous month.
  const monthColumns = [...(chartData?.average ?? [])]
    .sort((a, b) => b.month_date.localeCompare(a.month_date))
    .slice(0, 2);

  const today = dayjs().format("YYYY-MM-DD");
  const todayRow = (chartData?.data ?? []).find((item) => gradeRowDate(item) === today);

  const cellStyleFor = (row: GradeRow) => (row.isTotal ? totalCellStyle : bodyCellStyle);

  const columns: TableProps<GradeRow>["columns"] = [
    {
      title: t("col.grade", "등급"),
      dataIndex: "labelKey",
      key: "grade",
      align: "center",
      onHeaderCell: () => ({ style: headerCellStyle }),
      onCell: (record) => ({ style: cellStyleFor(record) }),
      render: (_: string, record: GradeRow) => t(record.labelKey),
    },
    {
      title: t("userStats.today", "당일"),
      dataIndex: "daily",
      key: "daily",
      align: "center",
      onHeaderCell: () => ({ style: headerCellStyle }),
      onCell: (record: GradeRow) => ({ style: cellStyleFor(record) }),
      render: (_: unknown, record: GradeRow) => (
        <CommaNumber
          value={
            todayRow
              ? (todayRow[`${record.dailyKey}_with_bet` as keyof BettingGradeChartData] as
                  | number
                  | undefined)
              : null
          }
          onlyNumber
        />
      ),
    },
    ...monthColumns.map((month) => ({
      title: t("gradeTable.monthLabel", "{{month}}월", { month: dayjs(month.month_date).format("M") }),
      dataIndex: month.month_date,
      key: month.month_date,
      align: "center" as const,
      onHeaderCell: () => ({ style: headerCellStyle }),
      onCell: (record: GradeRow) => ({ style: cellStyleFor(record) }),
      render: (_: unknown, record: GradeRow) => (
        <CommaNumber value={month[`${record.avgKey}_with_bet` as AvgKey]} onlyNumber />
      ),
    })),
  ];

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
        <Spin />
      </div>
    );
  }
  if (!chartData || monthColumns.length === 0) {
    return <Empty style={{ minHeight: 150 }} />;
  }

  return <Table size="small" columns={columns} dataSource={GRADE_ROWS} rowKey="key" pagination={false} />;
};

export default GradeUserMonthlyTable;
