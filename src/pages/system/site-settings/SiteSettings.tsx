import { useEffect, useState } from "react";
import { Button, Card, Form, Input, notification, Space, Typography } from "antd";
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { siteConfigAPI } from "@/api/site-config/get";
import { updateSiteConfigAPI } from "@/api/site-config/put";

const SiteSettings = () => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = siteConfigAPI();
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = async (values: any) => {
    try {
      const response = await updateSiteConfigAPI({
        telegram_cs_id: values.telegram_cs_id,
        telegram_channel_id: values.telegram_channel_id,
      });

      if (response.data.code === 0) {
        notification.success({
          message: t("toast.siteSettings.updateSuccess"),
        });
        setDisabled(true);
        mutate();
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      notification.error({ message: t("toast.siteSettings.updateFailed") });
    }
  };

  useEffect(() => {
    if (data && !isLoading) {
      form.setFieldsValue({
        telegram_cs_id: data.data?.telegram_cs_id || "",
        telegram_channel_id: data.data?.telegram_channel_id || "",
      });
    }
  }, [data, isLoading]);

  return (
    <Card
      title={<Typography.Title level={4}>{t("siteSettings.title")}</Typography.Title>}
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
                  if (data) {
                    form.setFieldsValue({
                      telegram_cs_id: data.data?.telegram_cs_id || "",
                      telegram_channel_id: data.data?.telegram_channel_id || "",
                    });
                  }
                }}
              >
                {t("global.cancel")}
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
              >
                {t("global.save")}
              </Button>
            </>
          )}
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={disabled}>
        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          {t("siteSettings.telegramSection")}
        </Typography.Title>

        <Form.Item
          name="telegram_cs_id"
          label={t("siteSettings.telegramCsId")}
          extra={t("siteSettings.telegramCsIdHint")}
        >
          <Input placeholder="roypay_cs" />
        </Form.Item>

        <Form.Item
          name="telegram_channel_id"
          label={t("siteSettings.telegramChannelId")}
          extra={t("siteSettings.telegramChannelIdHint")}
        >
          <Input placeholder="roypay" />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SiteSettings;
