import { useEffect, useState } from "react";
import { Button, Card, Form, Space, Switch, Typography, notification } from "antd";
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getSystemConfigValue } from "@/api/system-config/get";
import { updateSystemConfigValue } from "@/api/system-config/put";

const RELOAD_KEY = "DEPOSIT_BONUS_BLOCK_RELOAD_ON_WITHDRAWAL";
const FIRST_KEY = "DEPOSIT_BONUS_BLOCK_FIRST_ON_WITHDRAWAL";

interface FormData {
  reload: boolean;
  first: boolean;
}

const BonusPolicy = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [reload, first] = await Promise.all([
        getSystemConfigValue(RELOAD_KEY),
        getSystemConfigValue(FIRST_KEY),
      ]);
      form.setFieldsValue({
        reload: reload.data?.value === "1",
        first: first.data?.value === "1",
      });
    } catch (error) {
      notification.error({ message: t("transactionRules.bonusPolicy.loadFailed") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: FormData) => {
    try {
      const [reloadRes, firstRes] = await Promise.all([
        updateSystemConfigValue(RELOAD_KEY, values.reload ? "1" : "0"),
        updateSystemConfigValue(FIRST_KEY, values.first ? "1" : "0"),
      ]);

      if (reloadRes.code === 0 && firstRes.code === 0) {
        notification.success({ message: t("toast.common.updateSuccess") });
        setDisabled(true);
      } else {
        notification.error({ message: reloadRes.message || firstRes.message });
      }
    } catch (error) {
      notification.error({ message: t("toast.common.updateFailed") });
    }
  };

  return (
    <Card
      title={<Typography.Title level={4}>{t("transactionRules.bonusPolicy.title")}</Typography.Title>}
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
              <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>
                {t("global.save")}
              </Button>
            </>
          )}
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={disabled || loading}>
        {/* ON (checked) == raw stored "1" for BOTH keys — do not invert this
            mapping per key. Only the *seed defaults* differ (reload seeded
            "1"/blocking-on, first seeded "0"/not-blocking) — that's data from
            the API, not frontend logic. See TRANSACTION_RULES_FRONTEND_INTEGRATION §5. */}
        <Form.Item
          name="reload"
          label={t("transactionRules.bonusPolicy.blockReload")}
          extra={t("transactionRules.bonusPolicy.blockReloadHint")}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="first"
          label={t("transactionRules.bonusPolicy.blockFirst")}
          extra={t("transactionRules.bonusPolicy.blockFirstHint")}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BonusPolicy;
