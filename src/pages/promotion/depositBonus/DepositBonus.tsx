import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { depositBonusesAPI } from "@/api/deposit-bonuses/get";
import CreateBtn from "@/components/CreateBtn";

const DepositBonus = () => {
  const { swr, onHeaderCell, paginationProps } = depositBonusesAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb />
        <CreateBtn />
      </Space>
      <Divider />
      <List
        data={swr.data}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default DepositBonus;
