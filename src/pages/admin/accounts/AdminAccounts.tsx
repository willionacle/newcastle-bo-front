import { useState } from "react";
import { Alert, Card, Divider, Space } from "antd";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/Breadcrumb";
import Btn from "@/components/Btn";
import Filter from "./Filter";
import List from "./List";
import FormModal from "./FormModal";
import PasswordModal from "./PasswordModal";
import {
  AdminAccount,
  adminAccountsListAPI,
  readListPage,
} from "@/api/admin-accounts/get";
import { httpStatus } from "./serverMessage";

// 관리자 계정 관리 — create, stop, restart, re-password and re-tier the back
// office admins of this client. Super-admin only, enforced server-side; the
// sidebar entry is hidden for everyone else but the URL still resolves, so this
// screen renders its own 403 state rather than assuming it was reached legally.
const AdminAccounts = () => {
  const { t } = useTranslation();
  const { swr, onHeaderCell, setFilters, paginationProps } = adminAccountsListAPI();
  const [creating, setCreating] = useState(false);
  const [passwordFor, setPasswordFor] = useState<AdminAccount | null>(null);

  const { rows, total } = readListPage(swr.data);
  const forbidden = httpStatus(swr.error) === 403;
  // code 1 with no rows is the migration guard — the message names the .sql file
  // that has not been applied to this client's database yet. Shown verbatim.
  const refusal = swr.data && swr.data.code !== 0 ? swr.data.message : null;

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={t("sidemenu.adminAccounts")} />
        {!forbidden && !refusal && <Btn btnType="create" onClick={() => setCreating(true)} />}
      </Space>
      <Divider />

      {forbidden ? (
        <Alert type="error" showIcon message={t("adminAccounts.forbidden")} />
      ) : refusal ? (
        <Alert type="warning" showIcon message={refusal} />
      ) : (
        <>
          <Filter setFilters={setFilters} />
          <Divider />
          <List
            data={rows}
            loading={swr.isLoading}
            pagination={paginationProps(total)}
            onHeaderCell={onHeaderCell}
            onSetPassword={setPasswordFor}
            mutate={() => swr.mutate()}
          />
        </>
      )}

      <FormModal
        open={creating}
        accounts={rows}
        onClose={() => setCreating(false)}
        onSaved={() => {
          setCreating(false);
          swr.mutate();
        }}
      />

      <PasswordModal
        account={passwordFor}
        onClose={() => setPasswordFor(null)}
        onSaved={() => {
          setPasswordFor(null);
          swr.mutate();
        }}
      />
    </Card>
  );
};

export default AdminAccounts;
