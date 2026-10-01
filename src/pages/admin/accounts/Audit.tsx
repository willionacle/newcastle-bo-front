import { Alert, Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import AuditFilter from "./AuditFilter";
import AuditList from "./AuditList";
import { adminAuditListAPI, readListPage } from "@/api/admin-accounts/get";
import { httpStatus } from "./serverMessage";

// The admin account audit trail. One row per action, never a password, a hash
// or a token — a password change records that it happened, never what to.
const Audit = () => {
  const { t } = useTranslation();
  const { swr, onHeaderCell, setFilters, paginationProps } = adminAuditListAPI();

  const { rows, total } = readListPage(swr.data);
  const forbidden = httpStatus(swr.error) === 403;
  const refusal = swr.data && swr.data.code !== 0 ? swr.data.message : null;

  return (
    <Card>
      {/* Breadcrumb matches on /<group>/<first segment>, which would resolve to
          the accounts screen here — so the title is passed in. */}
      <Breadcrumb replace={t("sidemenu.adminAccountsAudit")} />
      <Divider />

      {forbidden ? (
        <Alert type="error" showIcon message={t("adminAccounts.forbidden")} />
      ) : refusal ? (
        <Alert type="warning" showIcon message={refusal} />
      ) : (
        <>
          <AuditFilter setFilters={setFilters} />
          <Divider />
          <AuditList
            data={rows}
            loading={swr.isLoading}
            pagination={paginationProps(total)}
            onHeaderCell={onHeaderCell}
          />
        </>
      )}
    </Card>
  );
};

export default Audit;
