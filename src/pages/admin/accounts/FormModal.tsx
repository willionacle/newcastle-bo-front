import { useEffect, useState } from "react";
import { Alert, Form, Input, Modal, Select, notification } from "antd";
import { useTranslation } from "react-i18next";
import useUserStore from "@/store/user.store";
import { AdminAccount } from "@/api/admin-accounts/get";
import { createAdminAccountAPI } from "@/api/admin-accounts/post";
import { passwordRules } from "@/utils/passwordRules";
import SaveBtn from "@/components/SaveBtn";
import { serverMessage } from "./serverMessage";

interface FormData {
  username: string;
  password: string;
  name?: string;
  from?: string;
  role?: string;
}

interface Props {
  open: boolean;
  // Existing admins on this client, offered as clone templates.
  accounts: AdminAccount[];
  onClose: () => void;
  onSaved: () => void;
}

const FormModal = ({ open, accounts, onClose, onSaved }: Props) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();
  const [form] = Form.useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (values: FormData) => {
    setSubmitting(true);
    try {
      const res = await createAdminAccountAPI(
        {
          username: values.username.trim(),
          password: values.password,
          name: values.name?.trim() || undefined,
          from: values.from || undefined,
          role: values.role || undefined,
        },
        token
      );

      const { code, message } = res.data;
      if (code === 0) {
        notification.success({ message: message || t("toast.common.createSuccess") });
        onSaved();
      } else {
        notification.error({ message: message || t("adminAccounts.createFailed") });
      }
    } catch (error) {
      notification.error({ message: serverMessage(error, t("adminAccounts.createFailed")) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={t("adminAccounts.create")}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {/* A new admin is cloned from a working one: up_users has 153 columns and
          the login query needs a dozen of them sane. Wallets are reset to 0 and
          the template's password, session, and 2FA secret never come across.

          There is no super-admin switch here: the server refuses to create an
          account at that tier at all. The account is created ordinary and the
          tier is transferred to it afterwards, from the list. */}
      <Alert type="info" showIcon message={t("adminAccounts.createHint")} style={{ marginBottom: 16 }} />

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label={t("adminAccounts.username")}
          name="username"
          rules={[{ required: true, message: t("adminAccounts.usernameRequired") }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item label={t("adminAccounts.password")} name="password" rules={passwordRules(t)}>
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item label={t("adminAccounts.name")} name="name">
          <Input placeholder={t("adminAccounts.nameHint")} />
        </Form.Item>

        <Form.Item label={t("adminAccounts.from")} name="from" help={t("adminAccounts.fromHint")}>
          <Select allowClear showSearch optionFilterProp="children">
            {accounts.map((a) => (
              <Select.Option key={a.id} value={a.username}>
                {a.username}
                {a.name ? ` (${a.name})` : ""}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t("adminAccounts.role")} name="role" help={t("adminAccounts.roleHint")}>
          <Select allowClear>
            <Select.Option value="admin">admin</Select.Option>
            <Select.Option value="agent">agent</Select.Option>
          </Select>
        </Form.Item>

        <SaveBtn loading={submitting} />
      </Form>
    </Modal>
  );
};

export default FormModal;
