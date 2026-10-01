import { useEffect, useState } from "react";
import { Card, Space, Switch, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { getSystemConfigValue } from "@/api/system-config/get";
import { updateSystemConfigValue } from "@/api/system-config/put";

// Site-wide switch for whether welcome (가입 후 최초 1회) deposit bonuses can be
// granted at all — independent of each individual bonus's own `isWelcome` /
// `inUse` flags. Seeded ON, since nothing is flagged `isWelcome` yet, turning
// this off changes nothing until an operator creates one. See
// WELCOME_BONUS_AND_MAINTENANCE_FRONTEND_INTEGRATION.md §16.
const ENABLED_KEY = "WELCOME_BONUS_ENABLED";

const WelcomeBonusToggle = () => {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSystemConfigValue(ENABLED_KEY);
        setEnabled(res.data?.value === "1");
      } catch (error) {
        notification.error({ message: t("welcomeBonusToggle.loadFailed") });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = async (checked: boolean) => {
    const previous = enabled;
    setEnabled(checked);
    setSaving(true);
    try {
      const res = await updateSystemConfigValue(ENABLED_KEY, checked ? "1" : "0");
      if (res.code === 0) {
        notification.success({ message: t("toast.common.updateSuccess") });
      } else {
        setEnabled(previous);
        notification.error({ message: res.message || t("toast.common.updateFailed") });
      }
    } catch (error) {
      setEnabled(previous);
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card size="small" loading={loading} style={{ marginBottom: 16 }}>
      <Space align="center">
        <Switch checked={enabled} loading={saving} onChange={handleChange} />
        <div>
          <Typography.Text strong>{t("welcomeBonusToggle.label")}</Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {t("welcomeBonusToggle.hint")}
          </Typography.Text>
        </div>
      </Space>
    </Card>
  );
};

export default WelcomeBonusToggle;
