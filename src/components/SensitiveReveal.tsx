import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Flex, Typography, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  revealSensitiveInformationAPI,
  SensitiveCredential,
  SensitiveField,
  SensitiveValue,
} from "@/api/users/sensitive";
import useUserStore from "@/store/user.store";
import { classifySensitiveError } from "@/utils/sensitiveError";
import SensitivePasswordModal from "./SensitivePasswordModal";
import { useSensitiveView } from "./SensitiveViewProvider";

const HIDE_AFTER_MS = 30_000;

const labelKeys: Record<SensitiveField, string> = {
  phone: "sensitive.revealPhone",
  withdrawalAccount: "sensitive.revealWithdrawalAccount",
  usdtWallet: "sensitive.revealUsdtWallet",
};

function format(field: SensitiveField, value: SensitiveValue) {
  if (field === "phone") return value.phone_number || "-";
  if (field === "withdrawalAccount")
    return [value.bank_name, value.account_number, value.account_name].filter(Boolean).join(" ") || "-";
  return [value.w_network, value.w_wallet_address].filter(Boolean).join(" ") || "-";
}

/** The part worth copying: the number / address on its own. */
function copyText(field: SensitiveField, value: SensitiveValue) {
  if (field === "phone") return value.phone_number || "";
  if (field === "withdrawalAccount") return value.account_number || "";
  return value.w_wallet_address || "";
}

interface Props {
  userId: number;
  field: SensitiveField;
}

/**
 * POST /api/users/:id/sensitive/reveal (NEWCASTLE_HANDOFF §2.1).
 * First reveal asks for the access password; the returned viewToken is
 * cached (memory, per member + admin session) so later reveals within 10
 * minutes do not ask again. The value hides itself after 30 seconds.
 */
export default function SensitiveReveal({ userId, field }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState<SensitiveValue | null>(null);
  const [authenticate, setAuthenticate] = useState<{ notice?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const session = useSensitiveView();
  const adminToken = useUserStore((state) => state.token) || "";
  const timer = useRef<ReturnType<typeof setTimeout>>();
  // Bumped whenever the target changes, so a late response is dropped.
  const generation = useRef(0);

  const hide = () => {
    setValue(null);
    if (timer.current) clearTimeout(timer.current);
  };

  useEffect(() => {
    hide();
    setAuthenticate(null);
    setLoading(false);
    generation.current++;
    return () => {
      generation.current++;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [userId, field, session, adminToken]);

  /** Resolves with an inline error message, or nothing on success. */
  const reveal = async (credential: SensitiveCredential): Promise<string | void> => {
    const current = generation.current;
    const usedViewToken = "viewToken" in credential;
    setLoading(true);
    try {
      const res = await revealSensitiveInformationAPI(userId, field, credential);
      if (current !== generation.current) return;
      if (res.code !== 0 || !res.data) {
        const message = res.message || t("sensitive.failed");
        if (usedViewToken) notification.error({ message });
        return message;
      }
      session?.accept(userId, adminToken, res.data.viewToken);
      hide();
      setValue(res.data.value);
      timer.current = setTimeout(hide, HIDE_AFTER_MS);
    } catch (error) {
      if (current !== generation.current) return;
      const { kind, message } = classifySensitiveError(error);
      if (kind === "auth") {
        // Wrong password, or the cached view token expired / is foreign.
        session?.clear(userId, adminToken);
        if (usedViewToken) {
          setAuthenticate({ notice: t("sensitive.sessionExpired") });
          return;
        }
        return message || t("sensitive.wrongPassword");
      }
      const text =
        kind === "rateLimited"
          ? message || t("sensitive.tooManyAttempts")
          : message || t("sensitive.failed");
      if (usedViewToken) notification.error({ message: text });
      return text;
    } finally {
      if (current === generation.current) setLoading(false);
    }
  };

  const start = () => {
    const viewToken = session?.get(userId, adminToken);
    if (viewToken) void reveal({ viewToken });
    else setAuthenticate({});
  };

  return (
    <>
      {value ? (
        <Flex align="center" gap="0.3rem" style={{ minWidth: 0 }}>
          <Typography.Text
            copyable={copyText(field, value) ? { text: copyText(field, value) } : false}
            ellipsis={{ tooltip: format(field, value) }}
            style={{ flex: 1, minWidth: 0 }}
          >
            {format(field, value)}
          </Typography.Text>
          <Button size="small" icon={<EyeInvisibleOutlined />} onClick={hide}>
            {t("sensitive.hide")}
          </Button>
        </Flex>
      ) : (
        <Button
          className="user-button alt"
          size="small"
          icon={<EyeOutlined />}
          loading={loading}
          onClick={start}
        >
          {t(labelKeys[field])}
        </Button>
      )}
      {authenticate && (
        <SensitivePasswordModal
          notice={authenticate.notice}
          onConfirm={(accessPassword) => reveal({ accessPassword })}
          onCancel={() => setAuthenticate(null)}
        />
      )}
    </>
  );
}
