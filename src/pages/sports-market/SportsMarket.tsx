import i18next from "@/i18n/i18n";
import { Card, Divider } from "antd";
import Filter from "./Filter";
import List from "./List";
import Breadcrumb from "@/components/Breadcrumb";
import { sportsMarketAPI } from "@/api/sport-market/get";
import { ResUser } from "@/api/types";

interface Props {
  user?: ResUser['data'];
}

const SportsMarketRecord = ({ user }: Props) => {
  const { swr, onHeaderCell, paginationProps, setFilters } = sportsMarketAPI({filter_username: user?.username});

  const isAtUserDetailsPage = Boolean(user?.username);

  return (
    <Card>
      {!isAtUserDetailsPage && (
        <>
          <Breadcrumb replace={i18next.t("sidemenu.matchBettingRecords")} />
          <Divider />
        </>
      )}
      <Filter setFilter={setFilters} isAtUserDetailsPage />
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

export default SportsMarketRecord;
