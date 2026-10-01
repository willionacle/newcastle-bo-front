import { useState } from "react";
import { Card, Divider, Input } from "antd";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import AppliedRulesPanel from "@/components/transaction-rules/AppliedRulesPanel";

const TransactionRulesPreview = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>();

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Input.Search
        allowClear
        style={{ maxWidth: 320 }}
        placeholder={t("text.searchUsername")}
        onSearch={(value) => setUsername(value.trim() || undefined)}
      />
      <Divider />
      <AppliedRulesPanel username={username} />
    </Card>
  );
};

export default TransactionRulesPreview;
