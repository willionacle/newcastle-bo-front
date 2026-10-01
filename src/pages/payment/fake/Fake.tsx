import { fakeWithdrawalAPI } from "@/api/fake-withdrawal/get";
import Breadcrumb from "@/components/Breadcrumb";
import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";

const Fake = () => {
  const { swr, onHeaderCell, paginationProps } = fakeWithdrawalAPI();

  return (
    <Card>
      <Space>
        <Breadcrumb />
        <CreateBtn />
      </Space>
      <Divider />
      <List
        data={swr.data?.data}
        loading={swr.isLoading}
        mutate={swr.mutate}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.meta.pagination.total)}
      />
    </Card>
  );
};

export default Fake;
