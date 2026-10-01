import { Divider, Space } from "antd";
import { User } from "@/api/types";
import { dailyStatsRevenueAPI } from "@/api/dailystats-gamesumm/get";
import Filter from "./Filter";
import RevenueList from "../../topinfo/List";
import DailyStatsList from "../List";
// import { useLocation, useNavigate } from "react-router-dom";

// const items = (data: User): TabsProps["items"] => ([
//   {
//     key: '1',
//     label: '기간별통계',
//     children: <DailyStatistic data={data as User} asUserTabContent />,
//   },
//   {
//     key: '2',
//     label: '게임사별베팅통계',
//     children: <TopInfo username={data?.username} />,
//   },
// ]);


const StatsSubTabs = ({data}:{data: User}) => {
  // const navigate = useNavigate()
  // const {pathname} = useLocation();

  // return <Tabs defaultActiveKey="1" items={items(data)} onChange={() => navigate(`${pathname}?tab=dailystats`)} />;

  const { swr, onHeaderCell, paginationProps, setFilters } = dailyStatsRevenueAPI(data?.username);

  return (
    <Space direction="vertical">
      <Filter setFilters={setFilters} />
      <Divider />
      <RevenueList 
        data={swr.data?.revenue || []}
        loading={swr.isLoading}
      />
      <Divider />
      <DailyStatsList
        data={swr.data?.dailyStats || []}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        totals={swr.data?.totalSummary}
      />
    </Space>
  )
}

export default StatsSubTabs;