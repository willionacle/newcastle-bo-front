import { useEffect, useState } from "react";
import { Alert, Form, Input, Modal, notification } from "antd";
import { useTranslation } from "react-i18next";
import useUserStore from "@/store/user.store";
import { AdminAccount } from "@/api/admin-accounts/get";
import { setAdminPasswordAPI } from "@/api/admin-accounts/patch";
import { passwordRules } from "@/utils/passwordRules";
import SaveBtn from "@/components/SaveBtn";
import { serverMessage } from "./serverMessage";

interface FormData {
  password: string;
  confirm: string;
}

interface Props {
  account: AdminAccount | null;
  onClose: () => void;
  onSaved: () => void;
}

const PasswordModal = ({ account, onClose, onSaved }: Props) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();
  const [form] = Form.useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (account) form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const handleSubmit = async (values: FormData) => {
    if (!account) return;

    setSubmitting(true);
    try {
      const res = await setAdminPasswordAPI(account.id, values.password, token);
      const { code, message } = res.data;

      if (code === 0) {
        notification.success({ message: message || t("adminAccounts.passwordChanged") });
        onSaved();
      } else {
        notification.error({ message: message || t("adminAccounts.passwordFailed") });
      }
    } catch (error) {
      notification.error({ message: serverMessage(error, t("adminAccounts.passwordFailed")) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={!!account}
      title={t("adminAccounts.setPasswordFor", { username: account?.username ?? "" })}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {/* The server revokes that account's live sessions as part of this — a
          password change that leaves the old sessions alive locks nobody out. */}
      <Alert
        type="warning"
        showIcon
        message={t("adminAccounts.setPasswordWarning")}
        style={{ marginBottom: 16 }}
      />

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item label={t("adminAccounts.newPassword")} name="password" rules={passwordRules(t)}>
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          label={t("adminAccounts.confirmPassword")}
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: t("adminAccounts.passwordRequired") },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || getFieldValue("password") === value
                  ? Promise.resolve()
                  : Promise.reject(new Error(t("adminAccounts.passwordMismatch"))),
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <SaveBtn loading={submitting} />
      </Form>
    </Modal>
  );
};

export default PasswordModal;
