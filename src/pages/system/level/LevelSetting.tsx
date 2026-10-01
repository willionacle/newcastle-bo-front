import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Flex } from "antd";
import List from "./List";
import { levelConfingAPI } from "@/api/level-configs/get";
import CreateBtn from "@/components/CreateBtn";

const LevelSetting = () => {
  const { swr, onHeaderCell, paginationProps } = levelConfingAPI();

  return (
    <Card>
      <Flex align="center">
        <Breadcrumb />
        <CreateBtn />
      </Flex>
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default LevelSetting;
