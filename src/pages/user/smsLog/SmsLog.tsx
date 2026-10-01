import { SMSLogAPI } from "@/api/sms-log/get";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";

const SmsLog = () => {
  const { onHeaderCell, swr, paginationProps } = SMSLogAPI();


  return (
    <Card>
      <Breadcrumb />
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

export default SmsLog;
