import Breadcrumb from "@/components/Breadcrumb";
// import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { regulationAPI } from "@/api/regulation/get";
// import Filter from "./Filter";

const Regulation = () => {
  const { swr, onHeaderCell, paginationProps } = regulationAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb />
        {/* <CreateBtn /> */}
      </Space>
      {/* <Divider /> */}
      {/* <Filter setFilter={setFilters} /> */}
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default Regulation;
