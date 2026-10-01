import { Alert, Button, Card, Form, Input, Layout, Typography, message, notification } from "antd";
import { CopyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import NewcastleLogo from "@/components/NewcastleLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cardStyle, layoutStyle, logoStyle } from "./LoginStyle";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/user.store";
import useAdminAccessStore from "@/store/admin-access.store";
import { PostLogin, LoginData, loginAPI, verifyOtpAPI, hasSession } from "@/api/custom/login";

interface LoginFormType extends PostLogin {
  redirectPath?: string;
}

interface OtpFormType {
  code: string;
}

// 담당자 (operator) is remembered per-browser so the same person doesn't have
// to retype it every shift on a shared account.
const OPERATOR_STORAGE_KEY = "bo-login-operator";

// Two-step login: credentials → Google Authenticator OTP. On the first login a
// manager has no OTP set up yet, so the server returns `setup` and we show the
// enrolment QR / secret before asking for the first code. After enrolment, only
// the code is required. The real session is only issued once verify succeeds, so
// a manager who hasn't finished OTP can't reach anything else in the app.
//
// Kill-switch: `VITE_BO_OTP_LOGIN=false` turns the OTP step off in the UI
// (temporarily disabled 2026-08-10 at the Korean dev team's request — nothing is
// deleted, flip the var back to `true` to restore it). The gate is ultimately
// server-side: with 2FA disabled the backend issues the session straight from
// /api/auth/login, which `hasSession` detects — so this flow works with 2FA on
// or off regardless of the flag, and the flag only decides whether we still
// offer the code screen when the backend does ask for one.
const OTP_LOGIN_ENABLED = import.meta.env.VITE_BO_OTP_LOGIN !== "false";

const Login = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otp, setOtp] = useState<LoginData | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const setIsSuperAdmin = useAdminAccessStore((state) => state.setIsSuperAdmin);
  const navigate = useNavigate();

  const rememberedOperator = useMemo(
    () => localStorage.getItem(OPERATOR_STORAGE_KEY) ?? "",
    []
  );

  const handleLogin = async (e: LoginFormType) => {
    try {
      setLoading(true);
      const trimmedOperator = e.operator?.trim() || "";

      if (trimmedOperator) {
        localStorage.setItem(OPERATOR_STORAGE_KEY, trimmedOperator);
      } else {
        localStorage.removeItem(OPERATOR_STORAGE_KEY);
      }
      setOperator(trimmedOperator || null);

      const res = await loginAPI({
        username: e.username,
        password: e.password,
        user_agent: navigator.userAgent,
        operator: trimmedOperator || undefined,
      });

      const { code, message: msg, data } = res;

      if (code == 0) {
        if (hasSession(data)) {
          // 2FA is off server-side: /login already issued the real session, so
          // this is a plain one-step login.
          //
          // The tier goes to its own store and is kept out of the user store on
          // purpose: that one is persisted, and the menu must not run on a copy
          // saved at login. /api/auth/validate re-answers it on every page load.
          const { isSuperAdmin, ...session } = data;
          setIsSuperAdmin(isSuperAdmin === true);
          setUser({ ...session, userid: data.userId, operator: data.operator ?? (trimmedOperator || null) });
          navigate("/", { replace: true });
          return;
        }

        // Backend still wants a code. `data.setup` present means the manager
        // has not enrolled yet; otherwise just ask for the code. We show the
        // step even when OTP_LOGIN_ENABLED is false — the flag can't override a
        // server-side requirement, and blocking here would lock out managers who
        // do have the authenticator. Warn instead, so the mismatch is obvious.
        if (!OTP_LOGIN_ENABLED) {
          notification.warning({
            message: t("login.otpStillRequired"),
            description: t("login.otpStillRequiredDesc"),
          });
        }

        setOtp(data);
        setStep("otp");
      } else {
        // Server message stays verbatim (not translatable client-side).
        notification.error({
          message: t("login.loginFailed"),
          description: msg,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg =
          error.response.data?.error?.message ??
          error.response.data?.message ??
          t("login.invalidCredentials");

        notification.error({
          message: t("login.loginFailed"),
          description: errorMsg,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: OtpFormType) => {
    if (!otp?.otpToken) return;
    try {
      setLoading(true);
      const res = await verifyOtpAPI(e.code.trim(), otp.otpToken);

      const { code, message: msg, data } = res;

      if (code == 0) {
        const { isSuperAdmin, ...session } = data;
        setIsSuperAdmin(isSuperAdmin === true);
        setUser({ ...session, userid: data.userId, operator });
        navigate("/", { replace: true });
      } else {
        notification.error({
          message: t("login.verifyFailed"),
          description: msg,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // 401 here usually means the otpToken expired (it is short-lived) or the
        // code was wrong. Surface the server message; let the manager retry.
        const errorMsg =
          error.response.data?.error?.message ??
          error.response.data?.message ??
          t("login.invalidCode");

        notification.error({
          message: t("login.verifyFailed"),
          description: errorMsg,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const backToCredentials = () => {
    setStep("credentials");
    setOtp(null);
  };

  const copySecret = async () => {
    if (!otp?.setup?.secret) return;
    try {
      await navigator.clipboard.writeText(otp.setup.secret);
      message.success(t("login.secretCopied"));
    } catch {
      message.error(t("login.secretCopyFailed"));
    }
  };

  useEffect(() => {
    document.title = import.meta.env.VITE_BROWSER_TITLE;
  }, []);

  const setup = otp?.setup;

  return (
    <Layout style={layoutStyle}>
      {/* Language toggle, top-right — same switcher used in the app header. */}
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LanguageSwitcher />
      </div>

      <Card bordered={false} style={cardStyle}>
        <div style={{ ...logoStyle, display: "flex", justifyContent: "center" }}>
          <NewcastleLogo size="lg" />
        </div>

        {step === "credentials" && (
          <Form<LoginFormType> layout="vertical" onFinish={handleLogin}>
            <Form.Item name="redirectPath" hidden initialValue="/">
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label={t("login.username")}
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label={t("login.password")}
              rules={[{ required: true }]}
            >
              <Input type="password" placeholder="●●●●●●●●" size="large" />
            </Form.Item>

            <Form.Item
              name="operator"
              label={t("login.operator")}
              initialValue={rememberedOperator}
            >
              <Input size="large" maxLength={64} placeholder={t("login.operatorPlaceholder")} />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={loading}
            >
              {t("login.signIn")}
            </Button>
          </Form>
        )}

        {step === "otp" && (
          <Form<OtpFormType> layout="vertical" onFinish={handleVerify}>
            {setup ? (
              <>
                <Alert
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                  message={t("login.setupTitle")}
                  description={t("login.setupDesc")}
                />

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <QRCodeSVG value={setup.otpauthUrl} size={180} includeMargin />
                </div>

                <Form.Item label={t("login.setupKey")} style={{ marginBottom: 16 }}>
                  <Input
                    readOnly
                    size="large"
                    value={setup.secret}
                    addonAfter={
                      <CopyOutlined onClick={copySecret} style={{ cursor: "pointer" }} />
                    }
                  />
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {setup.issuer} ({setup.account})
                  </Typography.Text>
                </Form.Item>
              </>
            ) : (
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message={t("login.twofaTitle")}
                description={t("login.twofaDesc")}
              />
            )}

            <Form.Item
              name="code"
              label={t("login.code")}
              rules={[
                { required: true, message: t("login.codeRequired") },
                { pattern: /^\d{6}$/, message: t("login.codeDigits") },
              ]}
            >
              <Input
                size="large"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                autoFocus
              />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={loading}
            >
              {setup ? t("login.verifyAndFinish") : t("login.verify")}
            </Button>

            <Button
              type="link"
              block
              icon={<ArrowLeftOutlined />}
              style={{ marginTop: 8 }}
              onClick={backToCredentials}
              disabled={loading}
            >
              {t("login.backToLogin")}
            </Button>
          </Form>
        )}
      </Card>
    </Layout>
  );
};

export default Login;
