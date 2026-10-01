import { useEffect, useState } from "react";
import { Alert, Card, Empty, Skeleton, Space, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import useUserStore from "@/store/user.store";
import { transactionRulePreviewAPI, transactionRulesMetaAPI } from "@/api/transaction-rules/get";
import { TargetType, TransactionRuleMetaData } from "@/api/transaction-rules/types";

interface Props {
  username?: string;
}

const TARGET_COLOR: Record<TargetType, string> = { global: "default", partner: "blue", user: "purple" };

const AppliedRulesPanel = ({ username }: Props) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();
  const [meta, setMeta] = useState<TransactionRuleMetaData>();
  const { data: res, isLoading } = transactionRulePreviewAPI(username);

  useEffect(() => {
    (async () => {
      try {
        const metaRes = await transactionRulesMetaAPI(token);
        setMeta(metaRes.data?.data);
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!username) {
    return <Empty description={t("transactionRules.preview.enterUsername")} />;
  }

  if (isLoading || !meta) {
    return <Skeleton active />;
  }

  const data = res?.data;
  if (!data) {
    return <Empty description={t("transactionRules.preview.notFound")} />;
  }

  const formatValue = (field: string, value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (field === "block_first_bonus") {
      return value ? t("transactionRules.blockFirstBonus.block") : t("transactionRules.blockFirstBonus.allow");
    }
    if (field === "first_bonus_point_rate") {
      return `${((value as number) * 100).toFixed(2)}%`;
    }
    if (meta.timeFields.includes(field)) {
      return String(value);
    }
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return String(value);
  };

  const renderGroup = (title: string, fields: string[]) => (
    <Card size="small" title={title} style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {fields.map((field) => {
          const entry = data.effective[field];
          const label = meta.fieldLabels[field] ?? field;
          return (
            <div
              key={field}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--ant-color-split)",
                padding: "6px 0",
              }}
            >
              <Typography.Text>{label}</Typography.Text>
              <Space>
                <Typography.Text strong>{formatValue(field, entry?.value)}</Typography.Text>
                {entry?.source ? (
                  <Tag color={TARGET_COLOR[entry.source.targetType]}>
                    {`${meta.targets.find((tg) => tg.key === entry.source?.targetType)?.labelKo ?? entry.source.targetType} · ${entry.source.name}`}
                  </Tag>
                ) : (
                  <Tag color="default">{t("transactionRules.preview.unlimited")}</Tag>
                )}
              </Space>
            </div>
          );
        })}
      </Space>
    </Card>
  );

  return (
    <div>
      <Typography.Paragraph>
        <Typography.Text strong>{data.member.username}</Typography.Text>
        {data.member.partner && (
          <Typography.Text type="secondary"> · {data.member.partner}</Typography.Text>
        )}
      </Typography.Paragraph>

      <Alert
        style={{ marginBottom: 16 }}
        type={data.canWithdrawNow ? "success" : "warning"}
        showIcon
        message={
          data.canWithdrawNow
            ? t("transactionRules.preview.canWithdrawNow")
            : t("transactionRules.preview.cannotWithdrawNow")
        }
        description={
          data.blocks.length > 0 ? (
            <Space direction="vertical">
              {data.blocks.map((b, i) => (
                <Typography.Text key={i}>{b.message}</Typography.Text>
              ))}
            </Space>
          ) : undefined
        }
      />

      {renderGroup(t("transactionRules.group.deposit"), meta.fieldGroups.deposit)}
      {renderGroup(t("transactionRules.group.withdraw"), meta.fieldGroups.withdraw)}
      {renderGroup(t("transactionRules.group.bonus"), meta.fieldGroups.bonus)}
    </div>
  );
};

export default AppliedRulesPanel;
