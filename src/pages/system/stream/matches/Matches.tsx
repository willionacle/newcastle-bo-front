import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import Filter from "./Filter";
import { useTranslation } from "react-i18next";
import { streamcommunitylistApi } from "@/api/stream-community/get";

const Videos = () => {
  const { t }= useTranslation();
  const { swr ,onHeaderCell, setFilters,paginationProps } = streamcommunitylistApi();
  

  return (
    <Card>
      <Breadcrumb replace={t("col.streamingList")} />
      <Divider />
      <Filter setFilters={setFilters} />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  );
};

export default Videos;
