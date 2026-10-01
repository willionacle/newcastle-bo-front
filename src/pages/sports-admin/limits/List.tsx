import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider, Form, InputNumber, Switch, Button, Space, Tag, notification, Spin } from "antd";
import Breadcrumb from "@/components/Breadcrumb";
import { getSportsAdminLimitsAPI, SportsAdminLimit } from "@/api/sports-admin/get";
import { saveLimitsAPI, SaveLimitsPayload } from "@/api/sports-admin/put";

// 0 = unlimited, null (configured:false) = no row at all — never conflate the two.
// The odds fields carry their unit via the InputNumber's own addonAfter, so
// their label text must NOT repeat it (was showing "…배당 (배)" next to a "배"
// suffix — duplicated units, one of the alignment/i18n bugs this fixes).
const ODDS_KEYS = new Set(["SPORTS_MAX_ODDS_SINGLE", "SPORTS_MAX_ODDS_PARLAY"]);

const KEY_LABEL_I18N: Record<string, string> = {
  SPORTS_MAX_ODDS_SINGLE: "sportsAdmin.limitSingleOddsLabel",
  SPORTS_MAX_ODDS_PARLAY: "sportsAdmin.limitParlayOddsLabel",
  SPORTS_MAX_FOLDERS: "sportsAdmin.limitMaxFoldersLabel",
  SPORTS_MAX_WIN_AMOUNT: "sportsAdmin.limitMaxWinLabel",
  SPORTS_SAME_GAME_COMBO_ENABLED: "sportsAdmin.limitSameGameComboLabel",
};

const SportsAdminLimitsList = () => {
  const { t } = useTranslation();
  const [limits, setLimits] = useState<SportsAdminLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchLimits = async () => {
    setLoading(true);
    try {
      const res = await getSportsAdminLimitsAPI();
      const data = res.data.data ?? [];
      setLimits(data);
      const values: Record<string, number | boolean> = {};
      data.forEach((l) => {
        if (l.value === null) return;
        values[l.key] = l.key === "SPORTS_SAME_GAME_COMBO_ENABLED" ? l.value === 1 : l.value;
      });
      form.setFieldsValue(values);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: Record<string, number | boolean>) => {
    setSaving(true);
    try {
      // Only send fields the admin actually touched in the form — untouched
      // keys are omitted, per "send only the fields being changed."
      const touched = limits.filter((l) => form.isFieldTouched(l.key));
      if (touched.length === 0) {
        notification.info({ message: t("sportsAdmin.noChanges") });
        return;
      }

      const payload: SaveLimitsPayload = {};
      touched.forEach((l) => {
        const raw = values[l.key];
        (payload as any)[l.key] = l.key === "SPORTS_SAME_GAME_COMBO_ENABLED" ? (raw ? 1 : 0) : raw;
      });

      const res = await saveLimitsAPI(payload);
      if (res.data.code === 0) {
        notification.success({ message: res.data.message || t("toast.common.updateSuccess") });
        fetchLimits();
      } else {
        notification.error({ message: res.data.message });
      }
    } catch {
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <Breadcrumb replace={t("sportsAdmin.limitsMenu")} />
      <Divider />

      <Spin spinning={loading}>
        {/* Vertical layout, one bordered block per field — a horizontal
            label/input row couldn't keep these five very different label
            lengths ("최대 폴더 수" vs "슬립당 최대 당첨금 (0 = 제한없음)")
            aligned against a fixed label column, which is what was cramping
            and misaligning the form. */}
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 480 }}>
          {limits.map((limit) => (
            <Form.Item
              key={limit.key}
              label={
                <Space>
                  <span style={{ fontWeight: 600 }}>{t(KEY_LABEL_I18N[limit.key] ?? limit.key)}</span>
                  {!limit.configured && <Tag>{t("sportsAdmin.notConfigured")}</Tag>}
                </Space>
              }
              name={limit.key}
              valuePropName={limit.key === "SPORTS_SAME_GAME_COMBO_ENABLED" ? "checked" : "value"}
              extra={limit.description}
              style={{
                paddingBottom: 16,
                marginBottom: 16,
                borderBottom: "1px solid var(--ant-color-border-secondary)",
              }}
            >
              {limit.key === "SPORTS_SAME_GAME_COMBO_ENABLED" ? (
                <Switch />
              ) : (
                <InputNumber
                  min={0}
                  style={{ width: 220 }}
                  addonAfter={ODDS_KEYS.has(limit.key) ? t("sportsAdmin.timesUnit") : undefined}
                />
              )}
            </Form.Item>
          ))}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>
              {t("global.save")}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default SportsAdminLimitsList;
