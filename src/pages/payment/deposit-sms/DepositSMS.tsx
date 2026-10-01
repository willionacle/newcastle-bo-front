import i18next from "@/i18n/i18n";
import { depositSMSLogAPI } from "@/api/sms-log/get";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import Filter from "./Filter";

const DepositSMS = () => {
  const { onHeaderCell, swr, paginationProps, setFilters } = depositSMSLogAPI();


  return (
    <Card>
      <Breadcrumb replace={i18next.t("sidemenu.autoDepositUnprocessed")} />
      <Divider />
      <Filter setFilters={setFilters} />
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  );
};

export default DepositSMS;
