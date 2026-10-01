import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { depositBonusLogsAPI } from "@/api/deposit-bonuses/get";
import Filter from "./Filter";
import Total from "./component/Total";

const DepositBonusLog = () => {
    const { swr, onHeaderCell, paginationProps, setFilters } = depositBonusLogsAPI();
  return (
    <Card>
      <Breadcrumb replace={i18next.t("sidemenu.sm043")}/>

      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      <Total data={swr.data?.total} />
      <List
        data={swr.data}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
      />
    </Card>
  );
};

export default DepositBonusLog;
