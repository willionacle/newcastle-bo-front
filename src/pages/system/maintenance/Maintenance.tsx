import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { GameMaintenancesAPI } from "@/api/game-maintenances/get";
import Filter from "./Filter";
import GameCategoryButtonFilter from "@/components/GameCategoryBtn";
import { useTranslation } from "react-i18next";

const Maintenance = () => {
  const { t }= useTranslation();
  const { swr, onHeaderCell, setFilters } = GameMaintenancesAPI();

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm041")} />
      <Divider />
      <GameCategoryButtonFilter setFilters={setFilters} loading={swr.isLoading} forMaintenance />
      <Filter setFilters={setFilters} />

      <List
        data={swr.data ? swr.data?.data?.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)) : []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default Maintenance;
