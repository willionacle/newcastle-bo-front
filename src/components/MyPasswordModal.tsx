import { useEffect, useState } from "react";
import { Alert, Form, Input, Modal, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/user.store";
import { changeOwnPasswordAPI } from "@/api/admin-accounts/post";
import { passwordRules } from "@/utils/passwordRules";
import SaveBtn from "./SaveBtn";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirm: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

// 비밀번호 변경 for the signed-in admin. Available to every admin, not only the
// super-admin tier — /api/admin-accounts/me/password is the one route in that
// group that is not gated.
const MyPasswordModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const resetUser = useUserStore((state) => state.resetUser);
  const [form] = Form.useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (values: FormData) => {
    setSubmitting(true);
    try {
      const res = await changeOwnPasswordAPI(
        { currentPassword: values.currentPassword, newPassword: values.newPassword },
        token
      );

      const { code, message, data } = res.data;

      if (code === 0) {
        notification.success({
          message: message || t("adminAccounts.passwordChanged"),
          description: t("adminAccounts.reauthRequired"),
        });

        // The server revokes every session on the account, this one included —
        // data.reauthRequired says so. Go to /login deliberately instead of
        // letting the next background request 401 at some random moment.
        if (data?.reauthRequired !== false) {
          onClose();
          resetUser();
          navigate("/login", { replace: true });
          return;
        }

        onClose();
      } else {
        notification.error({ message: message || t("adminAccounts.passwordFailed") });
      }
    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message || t("adminAccounts.passwordFailed"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={t("adminAccounts.myPassword")}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Alert
        type="warning"
        showIcon
        message={t("adminAccounts.myPasswordWarning")}
        style={{ marginBottom: 16 }}
      />

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* Required even though the session already proves the account: the
            session proves the account, not the person sitting at it. This is
            what stops an unattended logged-in browser locking the owner out. */}
        <Form.Item
          label={t("adminAccounts.currentPassword")}
          name="currentPassword"
          rules={[{ required: true, message: t("adminAccounts.passwordRequired") }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>

        <Form.Item label={t("adminAccounts.newPassword")} name="newPassword" rules={passwordRules(t)}>
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          label={t("adminAccounts.confirmPassword")}
          name="confirm"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: t("adminAccounts.passwordRequired") },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || getFieldValue("newPassword") === value
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

export default MyPasswordModal;
