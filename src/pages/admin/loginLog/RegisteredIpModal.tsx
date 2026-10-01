import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Typography,
  notification,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { useTranslation } from "react-i18next";
import {
  REGISTERED_IPS_KEY,
  RegisteredIp,
  SUSPICIOUS_KEY,
  useRegisteredIpsAPI,
} from "@/api/admin-login-log/get";
import { addRegisteredIpAPI } from "@/api/admin-login-log/post";
import { deleteRegisteredIpAPI } from "@/api/admin-login-log/delete";
import DateText from "@/components/DateText";
import useAdminAccessStore from "@/store/admin-access.store";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  ip: string;
  description?: string;
}

/**
 * Registered (allow-listed) admin IPs. Anyone can view; adding/removing is
 * super-admin only on the server (403 + message for others), so the controls
 * are hidden unless isSuperAdmin === true. That is a UI hint only, the server
 * checks again. Server refusals are shown inside the modal, not as global toasts.
 */
const RegisteredIpModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const isSuperAdmin = useAdminAccessStore((s) => s.isSuperAdmin) === true;
  const swr = useRegisteredIpsAPI(open);

  useEffect(() => {
    if (!open) setActionError(null);
  }, [open]);

  const refresh = () => {
    mutate(REGISTERED_IPS_KEY);
    // Revalidate detection too so the menu badge drops right away
    mutate(SUSPICIOUS_KEY);
  };

  const failMessage = (message: string | undefined, status: number) =>
    message || `${t("global.fail")} (HTTP ${status})`;

  const handleAdd = async (e: FormData) => {
    setSaving(true);
    setActionError(null);
    try {
      const res = await addRegisteredIpAPI({
        ip: e.ip.trim(),
        description: e.description?.trim() || undefined,
      });

      if (res.ok) {
        notification.success({
          message:
            res.status === 200
              ? t("adminLog.ipAlreadyRegistered")
              : t("global.success"),
        });
        form.resetFields();
        refresh();
      } else {
        setActionError(failMessage(res.message, res.status));
      }
    } catch {
      // Statuses pass through (passThroughStatus), so only network failures land here
      setActionError(t("global.fail"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ip: string) => {
    setActionError(null);
    try {
      const res = await deleteRegisteredIpAPI(ip);

      if (res.ok) {
        notification.success({ message: t("global.success") });
        refresh();
      } else {
        setActionError(failMessage(res.message, res.status));
        // 404 = not registered (already removed elsewhere); resync the list
        if (res.status === 404) refresh();
      }
    } catch {
      setActionError(t("global.fail"));
    }
  };

  const columns: TableProps<RegisteredIp>["columns"] = [
    {
      title: t("adminLog.adl007"),
      dataIndex: "ip",
      align: "center",
    },
    {
      title: t("adminLog.adl018"),
      dataIndex: "description",
      align: "center",
      render: (value: string | null) => value || "-",
    },
    {
      title: t("adminLog.adl019"),
      dataIndex: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
  ];

  if (isSuperAdmin) {
    columns.push({
      title: t("global.action"),
      key: "action",
      align: "center",
      width: 90,
      render: (_value, record) => (
        <Popconfirm
          title={t("adminLog.adl020")}
          onConfirm={() => handleDelete(record.ip)}
          okText={t("global.delete")}
          cancelText={t("global.cancel")}
          okButtonProps={{ danger: true }}
        >
          <Button type="link" danger size="small" icon={<DeleteOutlined />}>
            {t("global.delete")}
          </Button>
        </Popconfirm>
      ),
    });
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
      title={t("adminLog.adl016")}
    >
      <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
        {t("adminLog.adl017")}
      </Typography.Paragraph>

      {isSuperAdmin ? (
        <Form<FormData>
          form={form}
          layout="inline"
          onFinish={handleAdd}
          style={{ marginBottom: 16, rowGap: 8 }}
        >
          <Form.Item
            name="ip"
            rules={[{ required: true, whitespace: true }]}
            style={{ flex: "0 0 200px" }}
          >
            <Input placeholder="ex) 111.111.111.111" />
          </Form.Item>
          <Form.Item name="description" style={{ flex: 1, minWidth: 160 }}>
            <Input placeholder={t("adminLog.adl018")} maxLength={500} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>
              {t("adminLog.adl021")}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message={t("adminLog.ipSuperAdminOnly")}
        />
      )}

      {actionError && (
        <Alert
          type="error"
          showIcon
          closable
          onClose={() => setActionError(null)}
          style={{ marginBottom: 16 }}
          message={actionError}
        />
      )}

      {swr.error && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message={(swr.error as Error)?.message || t("global.fail")}
        />
      )}

      <Table<RegisteredIp>
        size="small"
        rowKey="ip"
        columns={columns}
        dataSource={swr.data}
        loading={swr.isLoading}
        pagination={{ pageSize: 10, size: "small" }}
      />

      <Space style={{ marginTop: 12, justifyContent: "flex-end", width: "100%" }}>
        <Button onClick={onClose}>{t("adminLog.adl022")}</Button>
      </Space>
    </Modal>
  );
};

export default RegisteredIpModal;
