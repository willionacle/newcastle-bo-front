import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import { sportGamesAPI } from "@/api/sport-games/get";
import Filter from "./Filter";
import { useTranslation } from "react-i18next";

const SportGames = () => {
  const { swr, paginationProps, setFilters } = sportGamesAPI();
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sportGames")} />
      <Divider />
      <Filter setFilters={setFilters} />
      <Divider />
      <List
        data={swr.data ? swr.data.data : []}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
      />
    </Card>
  );
};

export default SportGames;
