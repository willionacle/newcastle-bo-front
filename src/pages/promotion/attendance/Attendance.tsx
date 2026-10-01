import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import SettingsPanel from "./components/SettingsPanel";
import RewardsGrid from "./components/RewardsGrid";

// 출석체크 (daily attendance check) admin — settings + the day → reward
// ladder grid. Claim log lives on its own route/page (see
// pages/promotion/attendance-log). See ATTENDANCE_FRONTEND_INTEGRATION.md
// Part B. NOT 첫충전 (first-deposit-of-day bonus) — separate feature/backend.
const Attendance = () => {
  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <SettingsPanel />
      <RewardsGrid />
    </Card>
  );
};

export default Attendance;
