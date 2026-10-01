import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Alert, Card, Divider, Space } from "antd";
import Filter from "./Filter";
import List from "./List";
import { userAPI } from "@/api/users/get";
import CreateBtn from "@/components/CreateBtn";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import commaNumber from "comma-number";

const UserManagement: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { onHeaderCell, listSwr, summarySwr, setFilters, paginationProps } = userAPI();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  return (
    <Card>
      <Space align="center">
        <Breadcrumb
          replace={
            pathname === "/user"
              ? t("sidemenu.sm006")
              : status == "ROYALBLACK"
              ? t("memberInfo.royalBlack")
              : t("sidemenu.sm063")
          }
        />
        {/* UserList is mounted on /user, /user/observation and /user/royalblack,
            but only /user/create exists — pin the URL instead of deriving it. */}
        <CreateBtn url="/user/create" />
      </Space>
      <Divider />
      <Filter setBody={setFilters} />
      <Divider />
      <Alert
        message={
          <>
            <span style={{ marginRight: 30 }}>
              입금유저수: <a>{commaNumber(summarySwr.data?.data?.depositedUserCount ?? 0)}{i18next.t("unit.people")}</a>
            </span>
            <span style={{ marginRight: 30 }}>
              가입유저 입금율: <a>{(summarySwr.data?.data?.depositRate ?? 0).toFixed(2)}%</a>
            </span>
            <span style={{ marginRight: 30 }}>
              추천가입 유저수: <a>{commaNumber(summarySwr.data?.data?.recommendedUserCount ?? 0)}{i18next.t("unit.people")}</a>
            </span>
            <span style={{ marginRight: 10 }}>
              추천가입 입금유저수: <a>{commaNumber(summarySwr.data?.data?.recommendedDepositedUserCount ?? 0)}{i18next.t("unit.people")}</a>
            </span>
          </>
        }
        type="info"
        style={{ marginBottom: 12, fontSize: "14px", textAlign: "right" }}
      />
      <Divider />
      <List
        data={listSwr.data?.data?.items}
        loading={listSwr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(listSwr.data?.data?.pagination?.totalItems)}
      />
    </Card>
  );
};

export default UserManagement;
