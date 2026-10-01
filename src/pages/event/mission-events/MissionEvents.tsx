import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { useTranslation } from "react-i18next";
import { getDailyMissionEventsListAPI } from "@/api/daily-mission/mission-events/get";
import Filter from "./Filter";

const MissionEvents = () => {
  const { t } = useTranslation();
  const { swr, onHeaderCell, paginationProps, setFilters } =
    getDailyMissionEventsListAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={t("sidemenu.sm065")} />
      </Space>
      <Filter setFilter={setFilters} />
      <Divider />

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

export default MissionEvents;
