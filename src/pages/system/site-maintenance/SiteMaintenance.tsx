import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Input, Modal, Space, Switch, Typography, notification } from "antd";
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getSystemConfigValue } from "@/api/system-config/get";
import { updateSystemConfigValue } from "@/api/system-config/put";

// Site-wide maintenance mode (player site only — this repo keeps working
// through an incident). See
// WELCOME_BONUS_AND_MAINTENANCE_FRONTEND_INTEGRATION.md §18.
// Not to be confused with /system/maintenance (게임 관리), which is the
// per-game maintenance list — a different, pre-existing feature.
const ENABLED_KEY = "MAINTENANCE_ENABLED";
const MESSAGE_KEY = "MAINTENANCE_MESSAGE";
const UNTIL_KEY = "MAINTENANCE_UNTIL";
const ALLOW_IPS_KEY = "MAINTENANCE_ALLOW_IPS";

interface FormData {
  enabled: boolean;
  message: string;
  until: string;
  allowIps: string;
}

const SiteMaintenance = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Tracks the value as last loaded from the server, so we only prompt a
  // confirm when a save would actually flip the site OFF -> ON — not on
  // every save while it's already on (or already off).
  const [initialEnabled, setInitialEnabled] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [enabled, message, until, allowIps] = await Promise.all([
        getSystemConfigValue(ENABLED_KEY),
        getSystemConfigValue(MESSAGE_KEY),
        getSystemConfigValue(UNTIL_KEY),
        getSystemConfigValue(ALLOW_IPS_KEY),
      ]);
      const enabledValue = enabled.data?.value === "1";
      setInitialEnabled(enabledValue);
      form.setFieldsValue({
        enabled: enabledValue,
        message: message.data?.value || "",
        until: until.data?.value || "",
        allowIps: allowIps.data?.value || "",
      });
    } catch (error) {
      notification.error({ message: t("siteMaintenance.loadFailed") });
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
        updateSystemConfigValue(MESSAGE_KEY, values.message ?? ""),
        updateSystemConfigValue(UNTIL_KEY, values.until ?? ""),
        updateSystemConfigValue(ALLOW_IPS_KEY, values.allowIps ?? ""),
      ]);

      const failed = results.find((res) => res.code !== 0);
      if (!failed) {
        notification.success({ message: t("toast.common.updateSuccess") });
        setInitialEnabled(values.enabled);
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
    // Only the OFF -> ON transition closes the whole player site — that's
    // the one change worth an explicit confirmation.
    if (values.enabled && !initialEnabled) {
      Modal.confirm({
        title: t("siteMaintenance.enableConfirmTitle"),
        content: t("siteMaintenance.enableConfirmContent"),
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
    <Card
      title={<Typography.Title level={4}>{t("siteMaintenance.title")}</Typography.Title>}
      extra={
        <Space>
          {disabled ? (
            <Button icon={<EditOutlined />} onClick={() => setDisabled(false)}>
              {t("global.edit")}
            </Button>
          ) : (
            <>
              <Button
                icon={<StopOutlined />}
                onClick={() => {
                  setDisabled(true);
                  load();
                }}
              >
                {t("global.cancel")}
              </Button>
              <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
                {t("global.save")}
              </Button>
            </>
          )}
        </Space>
      }
    >
      {initialEnabled && (
        <Alert
          type="warning"
          showIcon
          message={t("siteMaintenance.currentlyOnBanner")}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={disabled || loading}>
        <Form.Item
          name="enabled"
          label={t("siteMaintenance.enableLabel")}
          extra={t("siteMaintenance.enableHint")}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="message"
          label={t("siteMaintenance.messageLabel")}
          extra={t("siteMaintenance.messageHint")}
        >
          <Input.TextArea rows={3} maxLength={500} showCount />
        </Form.Item>

        <Form.Item
          name="until"
          label={t("siteMaintenance.untilLabel")}
          extra={t("siteMaintenance.untilHint")}
        >
          <Input placeholder="2026-08-28 06:00" />
        </Form.Item>

        <Form.Item
          name="allowIps"
          label={t("siteMaintenance.allowIpsLabel")}
          extra={t("siteMaintenance.allowIpsHint")}
        >
          <Input placeholder="203.0.113.55, 203.0.113.56" />
        </Form.Item>
      </Form>

      {/* Not bound to a form field — the 503 body hands this back so an
          operator can paste it straight into 허용 IP without guessing which
          address the proxy sees them as. */}
      <Alert type="info" showIcon message={t("siteMaintenance.yourIpHint")} />
    </Card>
  );
};

export default SiteMaintenance;
