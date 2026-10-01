import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { useTranslation } from "react-i18next";
import { getCategoriesApi } from "@/api/stream-community/get";
import Filter from "./Filter";

const CategorySettings = () => {
   const { t }= useTranslation();
  const { swr, onHeaderCell, setFilters } = getCategoriesApi();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={t("col.sportManagement")}/>
      </Space>
      <Divider />
       <Filter setFilters={setFilters}/>
      <List
        data={swr.data ? swr.data.data : undefined}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default CategorySettings;
