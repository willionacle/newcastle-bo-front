import { Card, Divider } from "antd";
import Filter from "./Filter";
import { betLogsAPI } from "@/api/betting-logs/get";
import List from "./List";
import Breadcrumb from "@/components/Breadcrumb";
// import Total from "./component/Total";
import { useTranslation } from "react-i18next";

const BettingRecord = () => {
   const { t } = useTranslation();
  const { swr, onHeaderCell, paginationProps, setFilters } = betLogsAPI();

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm014")} />
      <Divider />
      <Filter setFilter={setFilters} />
      <Divider />
      {/* <Total data={swr.data?.total} /> */}
      <List
        data={swr.data?.data ?? []}
        totals={swr.data?.total}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default BettingRecord;
