import Breadcrumb from "@/components/Breadcrumb";
import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import { getSceventListApi } from "@/api/stream-community-event/get";

const StreamEvent = () => {
   const { t }= useTranslation();
  const { swr, onHeaderCell, paginationProps,setFilters } = getSceventListApi();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={t("col.event2")}/>
        <CreateBtn />
      </Space>
      <Divider />
      <Filter setFilters={setFilters}/>
      <List
        data={swr.data ? swr.data.data : undefined}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default StreamEvent;
