import i18next from "@/i18n/i18n";
import { Card, Divider } from "antd";
import Breadcrumb from "@/components/Breadcrumb";
import List from "./List";
import Filter from "./Filter";
import { loginEnvChangeLogsAPI } from "@/api/login-env-change-logs/get";

const LoginEnvChangeLog = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } =
    loginEnvChangeLogsAPI();

  return (
    <Card>
      <Breadcrumb replace={i18next.t("sidemenu.loginEnvChangeLog")} />
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <List
        data={swr.data?.data?.items ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(
          swr.data?.data?.pagination?.totalItems ?? 0
        )}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default LoginEnvChangeLog;
