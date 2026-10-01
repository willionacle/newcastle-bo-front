import { useMemo } from "react";
import dayjs from "dayjs";
import { Empty, Spin, Table, TableProps } from "antd";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  BettingGradeChartData,
  BettingGradeDailyAverage,
  getBettingGradeDailyTable,
} from "@/api/dashboard/get";
import CommaNumber from "@/components/CommaNumber";

type GradeKey = "black_diamond" | "diamond" | "ruby" | "emerald" | "gold" | "silver" | "bronze";
type GradeValues = Record<GradeKey | "total_user", number>;
type AvgKey = Exclude<keyof BettingGradeDailyAverage, "month_date">;

interface GradeTableRow {
  key: string;
  date: string;
  values?: GradeValues;
}

export const GRADE_FIELDS: { key: GradeKey; labelKey: string; avgKey: AvgKey }[] = [
  { key: "black_diamond", labelKey: "grade.blackDiamond", avgKey: "avg_black_diamond" },
  { key: "diamond", labelKey: "grade.diamond", avgKey: "avg_diamond" },
  { key: "ruby", labelKey: "grade.ruby", avgKey: "avg_ruby" },
  { key: "emerald", labelKey: "grade.emerald", avgKey: "avg_emerald" },
  { key: "gold", labelKey: "grade.gold", avgKey: "avg_gold" },
  { key: "silver", labelKey: "grade.silver", avgKey: "avg_silver" },
  { key: "bronze", labelKey: "grade.bronze", avgKey: "avg_bronze" },
];

/** Day key (YYYY-MM-DD) of a /chartbettinggradedaily row. */
export const gradeRowDate = (item: BettingGradeChartData) =>
  dayjs.utc(item.regdate ?? item.up_date).format("YYYY-MM-DD");

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

const SummaryCell = styled(Table.Summary.Cell)`
  &.ant-table-cell {
    background-color: color-mix(in srgb, var(--ant-color-primary), transparent 95%);
    color: color-mix(in srgb, var(--ant-color-primary), black 5%);
    font-weight: bold;
    padding: ${cellPadding} !important;
    font-size: ${cellFontSize};
    line-height: ${cellLineHeight};
  }
`;

/** Current month, one row per day: betting users per grade, plus monthly average summary rows. */
const GradeUserDailyTable = () => {
  const { t } = useTranslation();
  const { data: chartData, isLoading } = getBettingGradeDailyTable();

  const rows: GradeTableRow[] = useMemo(() => {
    const byDate = new Map<string, BettingGradeChartData>();
    (chartData?.data ?? []).forEach((item) => byDate.set(gradeRowDate(item), item));

    const start = dayjs().startOf("month");
    const daysInMonth = dayjs().daysInMonth();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = start.add(i, "day").format("YYYY-MM-DD");
      const match = byDate.get(date);
      const values: GradeValues | undefined = match
        ? {
            black_diamond: match.black_diamond,
            diamond: match.diamond,
            ruby: match.ruby,
            emerald: match.emerald,
            gold: match.gold,
            silver: match.silver,
            bronze: match.bronze,
            total_user: match.total_user,
          }
        : undefined;
      return { key: date, date, values };
    });
  }, [chartData]);

  const currentMonth = dayjs().format("YYYY-MM");
  const averageRows = [...(chartData?.average ?? [])]
    .sort((a, b) => b.month_date.localeCompare(a.month_date))
    .map((entry) => ({
      label:
        entry.month_date === currentMonth
          ? t("gradeTable.average", "평균")
          : t("gradeTable.monthLabel", "{{month}}월", { month: dayjs(entry.month_date).format("M") }),
      average: entry,
    }));

  const columns: TableProps<GradeTableRow>["columns"] = [
    {
      title: t("col.date", "날짜"),
      dataIndex: "date",
      key: "date",
      align: "center",
      onHeaderCell: () => ({ style: headerCellStyle }),
      onCell: () => ({ style: bodyCellStyle }),
      render: (value: string) => dayjs(value).format("M/D"),
    },
    ...GRADE_FIELDS.map(({ key, labelKey }) => ({
      title: t(labelKey),
      dataIndex: key,
      key,
      align: "center" as const,
      onHeaderCell: () => ({ style: headerCellStyle }),
      onCell: () => ({ style: bodyCellStyle }),
      render: (_: unknown, record: GradeTableRow) => (
        <CommaNumber value={record.values ? record.values[key] : null} onlyNumber />
      ),
    })),
    {
      title: t("global.sum", "합계"),
      dataIndex: "total_user",
      key: "total_user",
      align: "center",
      onHeaderCell: () => ({ style: headerCellStyle }),
      onCell: () => ({ style: bodyCellStyle }),
      render: (_: unknown, record: GradeTableRow) => (
        <CommaNumber value={record.values ? record.values.total_user : null} onlyNumber />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 288 }}>
        <Spin />
      </div>
    );
  }
  if (!chartData?.data || chartData.data.length === 0) {
    return <Empty style={{ minHeight: 288 }} />;
  }

  const renderAverageSummary = () => (
    <Table.Summary>
      {averageRows.map(({ label, average }) => (
        <Table.Summary.Row key={average.month_date}>
          <SummaryCell index={0} align="center">
            {label}
          </SummaryCell>
          {GRADE_FIELDS.map(({ key, avgKey }, index) => (
            <SummaryCell key={key} index={index + 1} align="center">
              <CommaNumber value={average[avgKey]} onlyNumber />
            </SummaryCell>
          ))}
          <SummaryCell index={GRADE_FIELDS.length + 1} align="center">
            <CommaNumber value={average.avg_total_user} onlyNumber />
          </SummaryCell>
        </Table.Summary.Row>
      ))}
    </Table.Summary>
  );

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={rows}
      rowKey="key"
      pagination={false}
      summary={renderAverageSummary}
      scroll={{ x: true }}
    />
  );
};

export default GradeUserDailyTable;
