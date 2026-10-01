import { useState } from "react";
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";
import BettingGradeLineChart from "./BettingGradeLineChart";
import GradeUserDailyTable from "@/components/GradeUserDailyTable";

/** Monthly grade chart + a button opening the current month's daily betting-users-by-grade table. */
const BettingGradeLineChartCard = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <Button
        type="text"
        size="small"
        style={{
          borderWidth: 1,
          borderColor: "var(--primary)",
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
        }}
        onClick={() => setOpen(true)}
      >
        {t("screenshot.view", "스크린샷보기")}
      </Button>
      <BettingGradeLineChart />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="min(1100px, 95vw)"
        title={t("screenshot.view", "스크린샷보기")}
        destroyOnClose
      >
        <GradeUserDailyTable />
      </Modal>
    </div>
  );
};

export default BettingGradeLineChartCard;
