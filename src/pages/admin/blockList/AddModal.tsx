import { useState } from "react";
import { Form, Input, Modal, Select, notification } from "antd";
import { useTranslation } from "react-i18next";
import { api } from "@/api/axios";
import useUserStore from "@/store/user.store";
import { PostAddBlockIP } from "@/api/types";
import SaveBtn from "@/components/SaveBtn";

const { TextArea } = Input;

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface FormData {
  ip: string;
  system_note: string;
  reason_code: PostAddBlockIP["reason_code"];
  username?: string;
  expires_minutes?: number;
}

// Basic IPv4 / IPv6 shape check — not exhaustive, just enough to catch typos
// before they hit the server (which is the actual source of truth).
const IP_PATTERN =
  /^(((\d{1,3}\.){3}\d{1,3})|([0-9a-fA-F:]+:[0-9a-fA-F:]+))$/;

// AUTO_LOGIN_FAILURES is system-only (see IP_BLOCK_FRONTEND_INTEGRATION.md §5) —
// not offered here since this form is always a manual action.
const REASON_OPTIONS: { value: NonNullable<PostAddBlockIP["reason_code"]>; labelKey: string }[] = [
  { value: "MANUAL", labelKey: "blockips.reasonManual" },
  { value: "ABUSE", labelKey: "blockips.reasonAbuse" },
  { value: "HACKING_ATTEMPT", labelKey: "blockips.reasonHackingAttempt" },
  { value: "OTHER", labelKey: "blockips.reasonOther" },
];

const EXPIRES_OPTIONS = [
  { value: 0, labelKey: "blockips.expiresPermanent" },
  { value: 60, labelKey: "blockips.expires1h" },
  { value: 1440, labelKey: "blockips.expires24h" },
  { value: 10080, labelKey: "blockips.expires7d" },
  { value: 43200, labelKey: "blockips.expires30d" },
];

const AddModal = ({ open, onClose, onSaved }: Props) => {
  const { t } = useTranslation();
  const { token, userid } = useUserStore.getState();
  const [form] = Form.useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: FormData) => {
    setSubmitting(true);
    try {
      const body: PostAddBlockIP = {
        userid,
        ip: values.ip.trim(),
        system_note: values.system_note.trim(),
        reason_code: values.reason_code,
        ...(values.username?.trim() ? { username: values.username.trim() } : {}),
        ...(values.expires_minutes ? { expires_minutes: values.expires_minutes } : {}),
      };

      const res = await api.createBlockIP(body, token);
      const { code, message } = res.data;

      if (code === 0) {
        notification.success({ message: t("toast.common.blockSuccess") });
        form.resetFields();
        onSaved();
      } else {
        // Server text stays verbatim (e.g. "IP Already exist.")
        notification.error({ message });
      }
    } catch (e: any) {
      notification.error({ message: t("toast.common.blockFailed") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={t("blockips.addTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={480}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ reason_code: "MANUAL", expires_minutes: 0 }}
      >
        <Form.Item
          label={t("blockips.ip")}
          name="ip"
          rules={[
            { required: true, message: t("blockips.ipRequired") },
            { pattern: IP_PATTERN, message: t("blockips.ipInvalid") },
          ]}
        >
          <Input placeholder={t("blockips.ipPlaceholder")} />
        </Form.Item>

        <Form.Item
          label={t("global.systemNote")}
          name="system_note"
          rules={[{ required: true, message: t("blockips.systemNoteRequired") }]}
        >
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item label={t("blockips.reasonCode")} name="reason_code">
          <Select
            options={REASON_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          />
        </Form.Item>

        <Form.Item label={t("blockips.username")} name="username">
          <Input placeholder={t("blockips.usernamePlaceholder")} allowClear />
        </Form.Item>

        <Form.Item label={t("blockips.expiresAt")} name="expires_minutes">
          <Select
            options={EXPIRES_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          />
        </Form.Item>

        <SaveBtn loading={submitting} />
      </Form>
    </Modal>
  );
};

export default AddModal;
