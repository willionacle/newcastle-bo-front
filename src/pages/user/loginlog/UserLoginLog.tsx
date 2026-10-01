import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { userLoginRecords } from "@/api/login-records/get";
import Filter from "./Filter";
import { useTranslation } from "react-i18next";

const UserLoginLog = () => {
  const { t } = useTranslation();
  const { swr, onHeaderCell, paginationProps, setFilters } = userLoginRecords();

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm058")} />
      <Divider />
      <Filter setFilter={setFilters} /> 
      <List
        data={swr.data?.data}
        loading={swr?.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
      />
    </Card>
  );
};

export default UserLoginLog;
