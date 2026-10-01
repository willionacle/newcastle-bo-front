import { useEffect, useState } from "react";
import { Button, Card, Form, Space, Switch, Tag, Typography, notification } from "antd";
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSiteProfileAPI, SiteProfileCategories, SiteProfilePreset } from "@/api/site-profile/get";
import { putSiteProfileAPI } from "@/api/site-profile/put";
import useSiteProfileStore from "@/store/site-profile.store";

// Five independent switches (카지노/슬롯/스포츠/미니게임/특수게임) plus two
// preset shortcuts. See PRODUCT_PROFILE_FRONTEND_INTEGRATION.md §3.
// "live" in the API/DB = 카지노 on screen — nothing translates that for us.
const CATEGORY_FIELDS: { name: keyof SiteProfileCategories; labelKey: string }[] = [
  { name: "live", labelKey: "siteProfile.categoryLive" },
  { name: "slot", labelKey: "siteProfile.categorySlot" },
  { name: "sports", labelKey: "siteProfile.categorySports" },
  { name: "minigame", labelKey: "siteProfile.categoryMinigame" },
  { name: "special", labelKey: "siteProfile.categorySpecial" },
];

const PRESET_LABEL: Record<SiteProfilePreset, string> = {
  SPORTS_AND_CASINO: "siteProfile.presetSportsAndCasino",
  CASINO_ONLY: "siteProfile.presetCasinoOnly",
  CUSTOM: "siteProfile.presetCustom",
};

const SiteProfile = () => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = useSiteProfileAPI();
  const preset = useSiteProfileStore((state) => state.data?.preset);
  const [form] = Form.useForm<SiteProfileCategories>();
  const [disabled, setDisabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [presetSaving, setPresetSaving] = useState<SiteProfilePreset | null>(null);

  const profile = data?.data;

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile.categories);
    }
  }, [profile, form]);

  // Sends only the fields that changed from what's currently loaded — never
  // all five unconditionally. "A subset, only what changed" per doc §3.
  const handleSubmit = async (values: SiteProfileCategories) => {
    if (!profile) return;
    const changed: Partial<SiteProfileCategories> = {};
    (Object.keys(values) as (keyof SiteProfileCategories)[]).forEach((key) => {
      if (values[key] !== profile.categories[key]) changed[key] = values[key];
    });
    if (Object.keys(changed).length === 0) {
      setDisabled(true);
      return;
    }

    setSaving(true);
    try {
      const res = await putSiteProfileAPI(changed);
      if (res.data.code === 0) {
        notification.success({ message: t("toast.siteProfile.updateSuccess") });
        setDisabled(true);
        mutate(res.data);
      } else {
        // code 1: partial failure — response.data.message names which
        // categories didn't save. Not a crash, just show it.
        notification.error({ message: res.data.message });
      }
    } catch (error) {
      notification.error({ message: t("toast.siteProfile.updateFailed") });
    } finally {
      setSaving(false);
    }
  };

  // Preset buttons are shortcuts, not a staged edit — they PUT immediately
  // as one request, same as sending flags directly.
  const applyPreset = async (nextPreset: SiteProfilePreset) => {
    setPresetSaving(nextPreset);
    try {
      const res = await putSiteProfileAPI({ preset: nextPreset });
      if (res.data.code === 0) {
        notification.success({ message: t("toast.siteProfile.updateSuccess") });
        mutate(res.data);
      } else {
        notification.error({ message: res.data.message });
      }
    } catch (error) {
      notification.error({ message: t("toast.siteProfile.updateFailed") });
    } finally {
      setPresetSaving(null);
    }
  };

  return (
    <Card
      title={<Typography.Title level={4}>{t("siteProfile.title")}</Typography.Title>}
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
                  if (profile) form.setFieldsValue(profile.categories);
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
      {preset && (
        <Typography.Paragraph>
          {t("siteProfile.currentPreset")}: <Tag>{t(PRESET_LABEL[preset])}</Tag>
        </Typography.Paragraph>
      )}

      <Space style={{ marginBottom: 24 }}>
        <Button loading={presetSaving === "SPORTS_AND_CASINO"} onClick={() => applyPreset("SPORTS_AND_CASINO")}>
          {t("siteProfile.presetSportsAndCasino")}
        </Button>
        <Button loading={presetSaving === "CASINO_ONLY"} onClick={() => applyPreset("CASINO_ONLY")}>
          {t("siteProfile.presetCasinoOnly")}
        </Button>
      </Space>

      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={disabled || isLoading}>
        <Space size="large" wrap>
          {CATEGORY_FIELDS.map(({ name, labelKey }) => (
            <Form.Item key={name} name={name} label={t(labelKey)} valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch />
            </Form.Item>
          ))}
        </Space>
      </Form>
    </Card>
  );
};

export default SiteProfile;
