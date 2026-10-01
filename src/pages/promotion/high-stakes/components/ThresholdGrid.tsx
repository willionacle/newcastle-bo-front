import { useEffect, useState } from "react";
import { Alert, Button, Card, Divider, InputNumber, Switch, Table, TableProps, Typography, notification } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getHighStakesThresholds, HighStakesThresholdRow } from "@/api/high-stakes/get-thresholds";
import { updateHighStakesThresholds } from "@/api/high-stakes/put-thresholds";
import { HighStakesCategory } from "@/api/high-stakes/types";

// 게임별 고액배팅 기준 grid (client request 20-1). Rows are the five fixed
// categories -- this can only edit them (PUT is a partial update by
// category), never add or remove a row. `gameCategory` is carried through
// from the GET response untouched; never hand-typed. amount:0 is "unset",
// not "off" -- that's what the isActive switch is for.
// See HIGH_STAKES_ALERT_FRONTEND_INTEGRATION.md §1.
interface RowState {
  key: number;
  gameCategory: HighStakesCategory;
  labelKo: string;
  sortOrder: number;
  amount: number;
  isActive: boolean;
}

const toRowState = (row: HighStakesThresholdRow): RowState => ({
  key: row.id,
  gameCategory: row.game_category,
  labelKo: row.label_ko,
  sortOrder: row.sort_order,
  amount: row.amount,
  isActive: row.is_active === 1,
});

const ThresholdGrid = () => {
  const { t } = useTranslation();
  const { data, anyActive, isLoading, mutate } = getHighStakesThresholds();
  const [rows, setRows] = useState<RowState[]>([]);
  const [saving, setSaving] = useState(false);

  // Only re-sync from the server on load/after a save (mutate) -- never on
  // every render, or in-progress edits would be clobbered.
  useEffect(() => {
    if (!data) return;
    setRows([...data].sort((a, b) => a.sort_order - b.sort_order).map(toRowState));
  }, [data]);

  const updateRow = (key: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateHighStakesThresholds(
        rows.map((row) => ({
          gameCategory: row.gameCategory,
          amount: row.amount ?? 0,
          isActive: row.isActive,
        }))
      );
      if (res.code === 0) {
        notification.success({ message: res.message || t("highStakes.saveSuccess") });
        mutate();
      } else {
        // e.g. an unrecognized category -- server message is verbatim Korean.
        notification.error({ message: res.message || t("highStakes.saveFailed") });
      }
    } catch (error) {
      notification.error({ message: t("highStakes.saveFailed") });
    } finally {
      setSaving(false);
    }
  };

  const columns: TableProps<RowState>["columns"] = [
    {
      title: t("highStakes.categoryColumn"),
      dataIndex: "labelKo",
      align: "center",
      width: 160,
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
    },
    {
      title: t("highStakes.amountColumn"),
      dataIndex: "amount",
      align: "center",
      render: (value: number, record) => (
        <InputNumber
          min={0}
          step={10000}
          value={value}
          style={{ width: 200 }}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(v) => Number(v!.replace(/,/g, "")) as any}
          onChange={(v) => updateRow(record.key, { amount: v ?? 0 })}
        />
      ),
    },
    {
      title: t("highStakes.isActiveColumn"),
      dataIndex: "isActive",
      align: "center",
      width: 120,
      render: (value: boolean, record) => (
        <Switch checked={value} onChange={(checked) => updateRow(record.key, { isActive: checked })} />
      ),
    },
  ];

  return (
    <Card size="small">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {t("highStakes.settingsTitle")}
        </Typography.Title>
        <Button size="small" type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
          {t("global.save")}
        </Button>
      </div>
      <Divider style={{ margin: "12px 0 16px" }} />

      <Alert
        type={anyActive ? "success" : "warning"}
        showIcon
        message={anyActive ? t("highStakes.anyActiveOn") : t("highStakes.anyActiveOff")}
        style={{ marginBottom: 16 }}
      />

      <Table rowKey="key" loading={isLoading} dataSource={rows} columns={columns} pagination={false} />
    </Card>
  );
};

export default ThresholdGrid;
