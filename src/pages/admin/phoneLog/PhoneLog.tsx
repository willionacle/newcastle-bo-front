import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { getPhoneNumberLog } from "@/api/phone-number-log/get";

const PhoneLog = () => {
  const { swr, paginationProps, onHeaderCell } = getPhoneNumberLog();
  

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
      />
    </Card>
  );
};

export default PhoneLog;
