import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { getPaybackLogAPI } from "@/api/payback-logs/get";
import Filter from "./Filter";

const PaybackLog = () => {
  const { swr, paginationProps, onHeaderCell, setFilters } = getPaybackLogAPI();
  return (
    <Card>
      <Breadcrumb  replace={i18next.t("sidemenu.sm044")} replaceDesc={i18next.t("promotion.payoutListAutoGen")}/>
      <Divider />
      <Filter setFilters={setFilters} />
      <List
        data={Array.isArray(swr.data?.data) ? swr.data.data : []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default PaybackLog;
