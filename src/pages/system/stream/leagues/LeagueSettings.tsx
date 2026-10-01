import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { useTranslation } from "react-i18next";
import { getLeagueApi } from "@/api/stream-community/get";
import Filter from "./Filter";

const LeagueSettings = () => {
   const { t }= useTranslation();
  const { swr, onHeaderCell, paginationProps, setFilters } = getLeagueApi();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={t("col.leagueManagement")}/>
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

export default LeagueSettings;
