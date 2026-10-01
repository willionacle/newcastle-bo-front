import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { adminLoginRecords } from "@/api/login-records/get";

const AdminLoginLog = () => {
  const { swr, onHeaderCell, paginationProps} = adminLoginRecords();

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr?.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
      />
    </Card>
  );
};

export default AdminLoginLog;
