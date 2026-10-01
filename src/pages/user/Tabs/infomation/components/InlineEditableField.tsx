import SensitivePasswordModal from "@/components/SensitivePasswordModal";
import SaveBtn from "@/components/SaveBtn";
import { classifySensitiveError } from "@/utils/sensitiveError";
import { Button, Input, Select, notification } from "antd";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  /** Read-only rendering shown when not editing. */
  display: ReactNode;
  /** Value pre-filled into the input when entering edit mode. */
  initialValue?: string;
  placeholder?: string;
  /** When provided, edit mode renders a Select instead of a text input. */
  options?: { label: string; value: string }[];
  /** Ask for the access password (admin's login password) before saving. */
  requireSensitivePassword?: boolean;
  /** Returns an error message to block the save, or nothing. */
  validate?: (value: string) => string | undefined;
  /** Persists the new value. Returns the standard `{ code, message }` shape. */
  onSave: (value: string, accessPassword?: string) => Promise<{ code: number; message: string }>;
  /** Called after a successful save. */
  onSaved: () => void;
}

/**
 * Two-step inline editor for a member 기본정보 field: read-only display +
 * 변경 → input/select + 저장 / 취소. Protected fields (PATCH /api/users with
 * accessPassword) go through SensitivePasswordModal, which shows a wrong
 * password (403) or rate limit (429) inline and lets the operator retry.
 */
const InlineEditableField = ({
  display,
  initialValue,
  placeholder,
  options,
  requireSensitivePassword = false,
  validate,
  onSave,
  onSaved,
}: Props) => {
  const { t } = useTranslation();
  const [authenticate, setAuthenticate] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const startEdit = () => {
    setValue(initialValue ?? "");
    setEditing(true);
  };

  const stopEdit = () => {
    setEditing(false);
    setValue("");
    setAuthenticate(false);
  };

  /** Resolves with an error message (kept inline in the modal), or nothing. */
  const save = async (accessPassword?: string): Promise<string | void> => {
    setLoading(true);
    try {
      const res = await onSave(value.trim(), accessPassword);
      if (res.code === 0) {
        notification.success({ message: res.message || t("toast.common.updateSuccess") });
        stopEdit();
        onSaved();
        return;
      }
      return res.message || t("toast.common.updateFailed");
    } catch (error) {
      const { kind, message } = classifySensitiveError(error);
      if (kind === "auth") return message || t("sensitive.wrongPassword");
      if (kind === "rateLimited") return message || t("sensitive.tooManyAttempts");
      return message || t("toast.common.updateFailed");
    } finally {
      setLoading(false);
    }
  };

  const requestSave = async () => {
    if (loading) return;
    const invalid = !value.trim() ? t("sensitive.valueRequired") : validate?.(value.trim());
    if (invalid) {
      notification.warning({ message: invalid });
      return;
    }
    if (requireSensitivePassword) {
      setAuthenticate(true);
      return;
    }
    const failure = await save();
    if (failure) notification.error({ message: failure });
  };

  if (!editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>{display}</div>
        <Button className="user-button alt" size="small" onClick={startEdit}>
          {t("sensitive.change")}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      {authenticate && (
        <SensitivePasswordModal onConfirm={save} onCancel={() => setAuthenticate(false)} />
      )}
      {options ? (
        <Select
          size="small"
          value={value || undefined}
          placeholder={placeholder}
          onChange={(v) => setValue(v)}
          options={options}
          style={{ flex: 1, minWidth: 120 }}
        />
      ) : (
        <Input
          size="small"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={() => void requestSave()}
          style={{ flex: 1 }}
        />
      )}
      <SaveBtn
        className="user-button alt"
        size="small"
        type="button"
        loading={loading}
        onClick={() => void requestSave()}
      />
      <Button className="user-button alt" size="small" disabled={loading} onClick={stopEdit}>
        {t("global.cancel")}
      </Button>
    </div>
  );
};

export default InlineEditableField;
