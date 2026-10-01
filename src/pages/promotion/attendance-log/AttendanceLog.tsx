import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Statistic } from "antd";
import Filter from "./Filter";
import List from "./List";
import { attendanceLogsListAPI, AttendanceLogTotals } from "@/api/attendance-logs/get";

// GET /api/attendance/logs — who claimed what. `totals` covers the whole
// filtered set, not just the current page, so it's shown above the table,
// not derived from the visible rows. See ATTENDANCE_FRONTEND_INTEGRATION.md §5.
const AttendanceLog = () => {
  const { t } = useTranslation();
  const { swr, onHeaderCell, paginationProps, setFilters } = attendanceLogsListAPI();
  const totals = swr.data?.totals as AttendanceLogTotals | undefined;

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Filter setFilters={setFilters} />
      <Divider />
      <div style={{ display: "flex", gap: 48, marginBottom: 16 }}>
        <Statistic title={t("attendance.totalClaims")} value={totals?.claims ?? 0} />
        <Statistic title={t("attendance.totalPaid")} value={totals?.paid ?? 0} suffix="원" />
      </div>
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
      />
    </Card>
  );
};

export default AttendanceLog;
