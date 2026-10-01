import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Flex } from "antd";
import List from "./List";
import { levelAccountAPI } from "@/api/level-account.tsx/get";
import CreateBtn from "@/components/CreateBtn";

const LevelAccount = () => {
  const { onHeaderCell, paginationProps, swr } = levelAccountAPI({type: 'level', columnby: 'level', orderby: 'asc'});

  return (
    <Card>
      <Flex align="center">
        <Breadcrumb />
        <CreateBtn />
      </Flex>
      <Divider />

      <List
        onHeaderCell={onHeaderCell}
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        mutate={swr.mutate}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  );
};

export default LevelAccount;
