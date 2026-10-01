import { useEffect, useState } from "react";
import { Alert, Button, Card, Divider, Form, InputNumber, Modal, Space, Switch, Typography, notification } from "antd";
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getSystemConfigValue } from "@/api/system-config/get";
import { updateSystemConfigValue } from "@/api/system-config/put";

// The three ATTENDANCE_* system_config rows. See
// ATTENDANCE_FRONTEND_INTEGRATION.md §6 — bind to `typedValue`, not `value`.
const ENABLED_KEY = "ATTENDANCE_ENABLED";
const MIN_DEPOSIT_KEY = "ATTENDANCE_MIN_DEPOSIT";
const ROLLOVER_MULTIPLIER_KEY = "ATTENDANCE_ROLLOVER_MULTIPLIER";

interface FormData {
  enabled: boolean;
  minDeposit: number;
  rolloverMultiplier: number;
}

const SettingsPanel = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Last-loaded values — used to decide which transitions deserve an
  // explicit confirm (OFF -> ON, or zeroing the rollover multiplier),
  // rather than confirming every save.
  const [initialEnabled, setInitialEnabled] = useState(false);
  const [initialMultiplier, setInitialMultiplier] = useState(1);
  const watchedMultiplier = Form.useWatch("rolloverMultiplier", form);

  const load = async () => {
    setLoading(true);
    try {
      const [enabled, minDeposit, rolloverMultiplier] = await Promise.all([
        getSystemConfigValue(ENABLED_KEY),
        getSystemConfigValue(MIN_DEPOSIT_KEY),
        getSystemConfigValue(ROLLOVER_MULTIPLIER_KEY),
      ]);
      const enabledValue = Number(enabled.data?.typedValue ?? enabled.data?.value ?? 0) === 1;
      const minDepositValue = Number(minDeposit.data?.typedValue ?? minDeposit.data?.value ?? 0);
      const multiplierValue = Number(rolloverMultiplier.data?.typedValue ?? rolloverMultiplier.data?.value ?? 0);

      setInitialEnabled(enabledValue);
      setInitialMultiplier(multiplierValue);
      form.setFieldsValue({
        enabled: enabledValue,
        minDeposit: minDepositValue,
        rolloverMultiplier: multiplierValue,
      });
    } catch (error) {
      notification.error({ message: t("attendance.loadFailed") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (values: FormData) => {
    setSaving(true);
    try {
      const results = await Promise.all([
        updateSystemConfigValue(ENABLED_KEY, values.enabled ? "1" : "0"),
        updateSystemConfigValue(MIN_DEPOSIT_KEY, String(values.minDeposit ?? 0)),
        updateSystemConfigValue(ROLLOVER_MULTIPLIER_KEY, String(values.rolloverMultiplier ?? 0)),
      ]);

      const failed = results.find((res) => res.code !== 0);
      if (!failed) {
        notification.success({ message: t("attendance.saveSuccess") });
        setInitialEnabled(values.enabled);
        setInitialMultiplier(values.rolloverMultiplier);
        setDisabled(true);
      } else {
        notification.error({ message: failed.message });
      }
    } catch (error) {
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (values: FormData) => {
    const enabling = values.enabled && !initialEnabled;
    const zeroingMultiplier = values.rolloverMultiplier === 0 && initialMultiplier !== 0;

    if (enabling || zeroingMultiplier) {
      Modal.confirm({
        title: enabling ? t("attendance.enableConfirmTitle") : t("attendance.confirmChangeTitle"),
        content: (
          <Space direction="vertical">
            {enabling && <span>{t("attendance.enableConfirmContent")}</span>}
            {zeroingMultiplier && (
              <span style={{ color: "#cf1322" }}>{t("attendance.rolloverMultiplierZeroWarning")}</span>
            )}
          </Space>
        ),
        okText: t("global.confirm"),
        cancelText: t("global.cancel"),
        okButtonProps: { danger: true },
        onOk: () => save(values),
      });
      return;
    }

    save(values);
  };

  return (
    <Card size="small" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {t("attendance.settingsTitle")}
        </Typography.Title>
        <Space>
          {disabled ? (
            <Button size="small" icon={<EditOutlined />} onClick={() => setDisabled(false)}>
              {t("global.edit")}
            </Button>
          ) : (
            <>
              <Button
                size="small"
                icon={<StopOutlined />}
                onClick={() => {
                  setDisabled(true);
                  load();
                }}
              >
                {t("global.cancel")}
              </Button>
              <Button size="small" type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
                {t("global.save")}
              </Button>
            </>
          )}
        </Space>
      </div>
      <Divider style={{ margin: "12px 0 16px" }} />

      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={disabled || loading}>
        <Form.Item name="enabled" label={t("attendance.enabledLabel")} extra={t("attendance.enabledHint")} valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="minDeposit" label={t("attendance.minDepositLabel")} extra={t("attendance.minDepositHint")}>
          <InputNumber min={0} style={{ width: 240 }} step={1000} />
        </Form.Item>

        <Form.Item name="rolloverMultiplier" label={t("attendance.rolloverMultiplierLabel")} extra={t("attendance.rolloverMultiplierHint")}>
          <InputNumber min={0} step={0.1} style={{ width: 240 }} />
        </Form.Item>
      </Form>

      {watchedMultiplier === 0 && (
        <Alert type="warning" showIcon message={t("attendance.rolloverMultiplierZeroWarning")} />
      )}
    </Card>
  );
};

export default SettingsPanel;
