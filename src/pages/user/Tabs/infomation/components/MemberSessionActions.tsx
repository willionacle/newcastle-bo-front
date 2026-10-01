import { CopyOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, Space, Typography, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SetPasswordData, setUserPasswordAPI } from "@/api/users/patch";
import { impersonateUserAPI } from "@/api/users/post";

// PASSWORD_RESET_AND_IMPERSONATION_FRONTEND_INTEGRATION.md §2 — the two
// member-row actions that replace reading `decode_password` off the row.

interface Props {
  username?: string;
}

const failureMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || fallback;

// "비밀번호 설정": optional password (8–72) → server sets it, or generates one
// when left blank. The returned value is shown ONCE — it is not stored and
// the next click produces a different one — so the modal stays open on the
// result view until the operator closes it deliberately.
export const SetPasswordButton = ({ username }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SetPasswordData | null>(null);
  const [form] = Form.useForm<{ password?: string }>();

  const close = () => {
    setOpen(false);
    setResult(null);
    form.resetFields();
  };

  const handleSubmit = async ({ password }: { password?: string }) => {
    if (!username) return;

    setLoading(true);
    try {
      const res = await setUserPasswordAPI(username, password?.trim() || undefined);
      if (res.code === 0 && res.data) {
        setResult(res.data);
      } else {
        notification.error({ message: res.message });
      }
    } catch (error: any) {
      notification.error({
        message: failureMessage(error, t("toast.common.actionFailed")),
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.password);
      notification.success({ message: t("toast.common.copied") });
    } catch {
      notification.error({ message: t("toast.common.copyFailed") });
    }
  };

  return (
    <>
      <Button
        className="user-button alt"
        size="small"
        onClick={() => setOpen(true)}
        disabled={!username}
      >
        {t("user.setPassword")}
      </Button>

      <Modal
        open={open}
        title={`${t("user.setPassword")} — ${username ?? ""}`}
        centered
        destroyOnClose
        onCancel={close}
        // Result view: no OK/Cancel; the only way out is the explicit close
        // so the password is not dismissed by a stray Enter.
        footer={
          result
            ? [
                <Button key="close" type="primary" onClick={close}>
                  {t("user.close")}
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={close}>
                  {t("global.cancel")}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={() => form.submit()}
                >
                  {t("user.setPassword")}
                </Button>,
              ]
        }
      >
        {result ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Alert
              type="warning"
              showIcon
              message={t("user.passwordShownOnce")}
            />
            <Space.Compact style={{ width: "100%" }}>
              <Input
                readOnly
                value={result.password}
                style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 1 }}
              />
              <Button icon={<CopyOutlined />} onClick={copyPassword}>
                {t("user.copy")}
              </Button>
            </Space.Compact>
            {result.signedOut && (
              <Typography.Text type="secondary">
                {t("user.memberSignedOut", { username: result.username })}
              </Typography.Text>
            )}
          </Space>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="password"
              label={t("user.newPasswordOptional")}
              extra={t("user.newPasswordHint")}
              rules={[
                {
                  validator: (_, value?: string) => {
                    const v = value?.trim() ?? "";
                    if (v === "" || (v.length >= 8 && v.length <= 72)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("user.passwordLengthRule")));
                  },
                },
              ]}
            >
              <Input.Password autoComplete="new-password" maxLength={72} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

// "로그인 대행": confirm (the member's live session ends), then open the
// player site with the session in the URL fragment — never the query string,
// so it stays out of server logs. The token is used only to build that URL.
export const ImpersonateButton = ({ username }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const playerUrl = (import.meta.env.VITE_PLAYER_URL ?? "").replace(/\/+$/, "");

  const run = async () => {
    if (!username) return;

    // Open the tab synchronously inside the click so popup blockers allow it;
    // the URL is filled in once the session arrives.
    const tab = window.open("", "_blank");
    setLoading(true);
    try {
      const res = await impersonateUserAPI(username);
      if (res.code === 0 && res.data) {
        const url = `${playerUrl}/impersonate#token=${encodeURIComponent(res.data.token)}`;
        if (tab) {
          tab.location.href = url;
        } else {
          window.open(url, "_blank");
        }
        notification.success({ message: res.message });
      } else {
        tab?.close();
        notification.error({ message: res.message });
      }
    } catch (error: any) {
      tab?.close();
      notification.error({
        message: failureMessage(error, t("toast.common.actionFailed")),
      });
    } finally {
      setLoading(false);
    }
  };

  const confirm = () => {
    if (!playerUrl) {
      notification.error({ message: t("user.playerUrlMissing") });
      return;
    }
    Modal.confirm({
      title: t("user.loginAsMember"),
      icon: <ExclamationCircleOutlined />,
      content: t("user.impersonateConfirm", { username }),
      okText: t("global.confirm"),
      cancelText: t("global.cancel"),
      okButtonProps: { danger: true },
      centered: true,
      onOk: run,
    });
  };

  return (
    <Button
      className="user-button alt"
      size="small"
      danger
      loading={loading}
      onClick={confirm}
      disabled={!username}
    >
      {t("user.loginAsMember")}
    </Button>
  );
};
