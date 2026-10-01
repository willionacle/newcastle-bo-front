import { Alert, Input, Modal, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  /**
   * Runs the protected operation with the typed access password.
   * Resolve with an error message to keep the modal open and show it inline
   * (wrong password 403, too many attempts 429, validation 400 …);
   * resolve with nothing to close.
   */
  onConfirm: (accessPassword: string) => Promise<string | void>;
  onCancel: () => void;
  /** Shown before the first attempt, e.g. "the view session expired". */
  notice?: string;
  title?: string;
}

/**
 * Asks for the access password (the admin's own login password) for one
 * operation. Mounted only while needed; the password is never stored — it is
 * cleared from state as soon as it is submitted.
 */
export default function SensitivePasswordModal({ onConfirm, onCancel, notice, title }: Props) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  // Read-only until focused so browsers/password managers do not autofill it.
  const [inputEnabled, setInputEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const confirm = async () => {
    if (!password || loading) return;
    const supplied = password;
    setPassword("");
    setError(undefined);
    setLoading(true);
    let failure: string | void;
    try {
      failure = await onConfirm(supplied);
    } catch {
      failure = t("sensitive.failed");
    } finally {
      setLoading(false);
    }
    if (failure) setError(failure);
    else onCancel();
  };

  return (
    <Modal
      open
      centered
      title={title ?? t("sensitive.authTitle")}
      okText={t("sensitive.authOk")}
      cancelText={t("global.cancel")}
      confirmLoading={loading}
      okButtonProps={{ disabled: !password || loading }}
      cancelButtonProps={{ disabled: loading }}
      closable={!loading}
      maskClosable={false}
      keyboard={!loading}
      destroyOnClose
      onOk={confirm}
      onCancel={() => {
        setPassword("");
        onCancel();
      }}
    >
      <Typography.Paragraph>{t("sensitive.authPrompt")}</Typography.Paragraph>
      {(error || notice) && (
        <Alert
          type={error ? "error" : "warning"}
          showIcon
          message={error || notice}
          style={{ marginBottom: 12 }}
        />
      )}
      <Input.Password
        autoFocus
        autoComplete="new-password"
        value={password}
        name="sensitive-operation-auth"
        aria-label={t("sensitive.authLabel")}
        placeholder={t("sensitive.authLabel")}
        readOnly={!inputEnabled}
        data-lpignore="true"
        data-1p-ignore="true"
        onFocus={() => {
          if (!inputEnabled) {
            setPassword("");
            setInputEnabled(true);
          }
        }}
        disabled={loading}
        maxLength={255}
        onChange={(event) => setPassword(event.target.value)}
        onPressEnter={confirm}
      />
    </Modal>
  );
}
