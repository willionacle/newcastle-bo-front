import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Spin,
  Tag,
  notification,
} from "antd";
import { ExclamationCircleOutlined, PoweroffOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDepositMethodList } from "@/api/deposit-method/get";
import {
  DEPOSIT_ACCOUNT_BULK_MAX_USERNAMES,
  disableDepositAccountsByTypeUsersAPI,
  enableDepositAccountsByTypeAPI,
} from "@/api/deposit-account/put";
import { notifyBulkError, notifyBulkResult } from "./bulkResult";

const { TextArea } = Input;

// 영문/숫자/언더스코어. 백엔드도 `_` 를 허용한다.
const USERNAME_PATTERN = /^[A-Za-z0-9_]{1,50}$/;

/** 줄바꿈·콤마·공백으로 구분된 아이디 목록을 정리하고 중복을 제거한다. */
const parseUsernames = (raw?: string): string[] => {
  const list = (raw || "")
    .split(/[\n,\s]+/)
    .map((u) => u.trim())
    .filter(Boolean);
  return Array.from(new Set(list));
};

type Mode = "enable" | "disable";

interface Props {
  mode: Mode;
}

/** 입금설정 > 선택한 입금방법 타입에 대해 입력한 회원들의 입금계정을 켜거나 끈다. */
const DepositMethodBulkUsers = ({ mode }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { data: depositMethods, isLoading: isLoadingMethods } =
    useDepositMethodList({});

  const isEnable = mode === "enable";
  const k = (key: string) => `depoMethodBulk.${mode}.${key}`;

  const selectedType: string | undefined = Form.useWatch("type", form);
  const usernamesRaw: string | undefined = Form.useWatch("usernames", form);
  const parsed = parseUsernames(usernamesRaw);
  const invalid = parsed.filter((u) => !USERNAME_PATTERN.test(u));
  const canSubmit = !!selectedType && parsed.length > 0;

  const handleSubmit = async () => {
    if (loading) return;
    const type: string | undefined = form.getFieldValue("type");
    const usernames = parseUsernames(form.getFieldValue("usernames"));

    if (!type) {
      notification.warning({ message: t("depoMethodBulk.selectType") });
      return;
    }
    if (usernames.length === 0) {
      notification.warning({ message: t("depoMethodBulk.enterUsernames") });
      return;
    }
    if (usernames.length > DEPOSIT_ACCOUNT_BULK_MAX_USERNAMES) {
      notification.warning({
        message: t("depoMethodBulk.tooManyUsernames", {
          max: DEPOSIT_ACCOUNT_BULK_MAX_USERNAMES.toLocaleString(),
        }),
      });
      return;
    }
    const bad = usernames.filter((u) => !USERNAME_PATTERN.test(u));
    if (bad.length > 0) {
      notification.warning({
        message: t("depoMethodBulk.invalidUsernames"),
        description: `${bad.slice(0, 10).join(", ")}${bad.length > 10 ? " ..." : ""}`,
      });
      return;
    }

    setLoading(true);
    try {
      const res = isEnable
        ? await enableDepositAccountsByTypeAPI(type, usernames)
        : await disableDepositAccountsByTypeUsersAPI(type, usernames);
      if (notifyBulkResult(res.data)) form.resetFields();
    } catch (error) {
      notifyBulkError(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingMethods) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Alert
        message={t(k("guideTitle"))}
        description={t(k("guideDesc"))}
        type="info"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 24 }}
      />
      <Card title={t(k("title"))}>
        <Form form={form} layout="vertical" style={{ maxWidth: 800 }}>
          <Form.Item
            label={t("depoMethodBulk.typeLabel")}
            name="type"
            rules={[{ required: true, message: t("depoMethodBulk.selectType") }]}
          >
            <Select
              placeholder={t("depoMethodBulk.selectType")}
              size="large"
              showSearch
              optionFilterProp="label"
              options={(depositMethods || []).map((m) => ({
                value: m.type,
                label: `${m.type} - ${m.title}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={t("depoMethodBulk.usernamesLabel")}
            name="usernames"
            extra={t("depoMethodBulk.usernamesHelp", {
              max: DEPOSIT_ACCOUNT_BULK_MAX_USERNAMES.toLocaleString(),
            })}
            rules={[{ required: true, message: t("depoMethodBulk.enterUsernames") }]}
          >
            <TextArea rows={8} placeholder={"user1\nuser2\nuser3"} />
          </Form.Item>

          {parsed.length > 0 && (
            <Space style={{ marginBottom: 16 }} wrap>
              <Tag color="blue">
                {t("depoMethodBulk.uniqueCount", { n: parsed.length.toLocaleString() })}
              </Tag>
              {invalid.length > 0 && (
                <Tag color="red">
                  {t("depoMethodBulk.invalidCount", { n: invalid.length })}
                </Tag>
              )}
              {parsed.length > DEPOSIT_ACCOUNT_BULK_MAX_USERNAMES && (
                <Tag color="red">
                  {t("depoMethodBulk.tooManyUsernames", {
                    max: DEPOSIT_ACCOUNT_BULK_MAX_USERNAMES.toLocaleString(),
                  })}
                </Tag>
              )}
            </Space>
          )}

          <Form.Item>
            <Space>
              <Popconfirm
                title={t(k("confirmTitle"))}
                description={t(k("confirmDesc"), {
                  type: selectedType,
                  n: parsed.length.toLocaleString(),
                })}
                onConfirm={handleSubmit}
                okText={t(k("submit"))}
                cancelText={t("global.cancel")}
                okButtonProps={{ danger: !isEnable }}
                disabled={!canSubmit}
              >
                <Button
                  type="primary"
                  danger={!isEnable}
                  icon={<PoweroffOutlined />}
                  loading={loading}
                  disabled={!canSubmit}
                  size="large"
                >
                  {t(k("submit"))}
                </Button>
              </Popconfirm>
              <Button onClick={() => form.resetFields()} size="large">
                {t("depoMethodBulk.reset")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DepositMethodBulkUsers;
