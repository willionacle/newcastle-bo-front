import { Card, Button, Divider } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import List from "./List";
import { useSessionsAPI } from "@/api/auth/sessions";

// "다른 기기 로그인" — every live session on the signed-in admin's own account
// (multi-session backend, 2026-08). Scoped server-side; there is no way to
// reach another account's sessions here, even by guessing an id.
const Sessions = () => {
  const { t } = useTranslation();
  const { swr } = useSessionsAPI();

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button icon={<ReloadOutlined />} onClick={() => swr.mutate()} loading={swr.isValidating}>
          {t("global.refresh")}
        </Button>
      </div>
      <List data={swr.data?.data ?? []} loading={swr.isLoading} mutate={swr.mutate} />
    </Card>
  );
};

export default Sessions;
