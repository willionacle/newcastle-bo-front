import { useEffect, useState } from "react";
import { Alert, Button, Card, Divider, InputNumber, Space, Table, TableProps, Typography, notification } from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getAttendanceRewards } from "@/api/attendance-rewards/get";
import { updateAttendanceRewards } from "@/api/attendance-rewards/put";

// 출석일수 → 보너스 grid. GET returns snake_case rows; PUT is a FULL REPLACE
// expecting camelCase { dayNumber, amount } — whatever this table shows on
// save becomes the entire ladder. Day numbers need not be contiguous, and
// amount: 0 is valid (keeps the streak alive, pays nothing).
// See ATTENDANCE_FRONTEND_INTEGRATION.md §4.
interface RowState {
  key: number;
  dayNumber: number | null;
  amount: number | null;
}

let nextKey = -1;

const RewardsGrid = () => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = getAttendanceRewards();
  const [rows, setRows] = useState<RowState[]>([]);
  const [saving, setSaving] = useState(false);

  // Only re-sync from the server on load/after a save (mutate) — never on
  // every render, or in-progress edits would be clobbered.
  useEffect(() => {
    if (!data) return;
    setRows(
      [...data]
        .sort((a, b) => a.day_number - b.day_number)
        .map((row) => ({ key: row.id, dayNumber: row.day_number, amount: row.amount }))
    );
  }, [data]);

  const updateRow = (key: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { key: nextKey--, dayNumber: null, amount: 0 }]);
  };

  const removeRow = (key: number) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const handleSave = async () => {
    if (rows.some((row) => row.dayNumber == null)) {
      notification.error({ message: t("attendance.dayNumberRequired") });
      return;
    }
    if (rows.some((row) => row.amount == null)) {
      notification.error({ message: t("attendance.amountRequired") });
      return;
    }

    setSaving(true);
    try {
      const res = await updateAttendanceRewards(
        rows.map((row) => ({ dayNumber: row.dayNumber as number, amount: row.amount as number }))
      );
      if (res.code === 0) {
        notification.success({ message: res.message || t("attendance.rewardsSaveSuccess") });
        mutate();
      } else {
        // Duplicate day numbers, etc. — server message is verbatim Korean.
        notification.error({ message: res.message || t("attendance.rewardsSaveFailed") });
      }
    } catch (error) {
      notification.error({ message: t("attendance.rewardsSaveFailed") });
    } finally {
      setSaving(false);
    }
  };

  const columns: TableProps<RowState>["columns"] = [
    {
      title: t("attendance.dayNumberColumn"),
      dataIndex: "dayNumber",
      align: "center",
      width: 160,
      render: (value: number | null, record) => (
        <InputNumber
          min={1}
          value={value}
          style={{ width: 120 }}
          onChange={(v) => updateRow(record.key, { dayNumber: v })}
        />
      ),
    },
    {
      title: t("attendance.amountColumn"),
      dataIndex: "amount",
      align: "center",
      render: (value: number | null, record) => (
        <InputNumber
          min={0}
          step={1000}
          value={value}
          style={{ width: 200 }}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(v) => Number(v!.replace(/,/g, "")) as any}
          onChange={(v) => updateRow(record.key, { amount: v })}
        />
      ),
    },
    {
      title: t("global.action"),
      align: "center",
      width: 100,
      render: (_, record) => (
        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => removeRow(record.key)} />
      ),
    },
  ];

  return (
    <Card size="small">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {t("attendance.rewardsTitle")}
        </Typography.Title>
        <Space>
          <Button size="small" icon={<PlusOutlined />} onClick={addRow}>
            {t("attendance.addRow")}
          </Button>
          <Button size="small" type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
            {t("attendance.saveRewards")}
          </Button>
        </Space>
      </div>
      <Divider style={{ margin: "12px 0 16px" }} />

      <Alert type="info" showIcon message={t("attendance.rewardsHint")} style={{ marginBottom: 16 }} />
      {rows.length === 0 && !isLoading && (
        <Alert type="warning" showIcon message={t("attendance.emptyRewardsWarning")} style={{ marginBottom: 16 }} />
      )}
      <Table
        rowKey="key"
        loading={isLoading}
        dataSource={rows}
        columns={columns}
        pagination={false}
      />
    </Card>
  );
};

export default RewardsGrid;
