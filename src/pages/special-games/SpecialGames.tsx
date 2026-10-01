import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";
import Filter from "./Filter";
import { specialGamesListAPI } from "@/api/special-games/get";

const SpecialGames = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = specialGamesListAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sidemenu.specialGamesList")} />
        <CreateBtn />
      </Space>
      <Filter setFilter={setFilters} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={() => swr.mutate()}
      />
    </Card>
  );
};

export default SpecialGames;
