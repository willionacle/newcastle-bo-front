import { BettingAmountChartData } from "@/api/dashboard/get";
import i18next from "@/i18n/i18n";
import { ResPostList } from "@/api/types";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { Table, TableProps } from "antd";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
}

const List = ({ data, loading}: Props) => {

  const columnsArray: TableProps<BettingAmountChartData>["columns"] = [
    {
      title: i18next.t("chart.byMonth"),
      dataIndex: "regdate",
      key: "regdate",
      align: "center",
      width: '6%',
      render: (value) => <DateText date={value} />
    },
    {
      title: i18next.t("title.live"),
      align: 'center',
      children: [
        {
          title: i18next.t("col.bet"),
          dataIndex: "total_live_bet_today",
          key: "total_live_bet_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("global.user"),
          dataIndex: "total_live_user_today",
          key: "total_live_user_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
      ]
    },
    {
      title: i18next.t("memberDetail.mis133"),
      align: 'center',
      children: [
        {
          title: i18next.t("col.bet"),
          dataIndex: "total_sports_bet_today",
          key: "total_sports_bet_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("global.user"),
          dataIndex: "total_sports_user_today",
          key: "total_sports_user_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
      ]
    },
    {
      title: i18next.t("title.esports"),
      align: 'center',
      children: [
        {
          title: i18next.t("col.bet"),
          dataIndex: "total_esports_bet_today",
          key: "total_esports_bet_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("global.user"),
          dataIndex: "total_esports_user_today",
          key: "total_esports_user_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
      ]
    },
    {
      title: i18next.t("memberDetail.mis132"),
      align: 'center',
      children: [
        {
          title: i18next.t("col.bet"),
          dataIndex: "total_slot_bet_today",
          key: "total_slot_bet_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("global.user"),
          dataIndex: "total_slot_user_today",
          key: "total_slot_user_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
      ]
    },
    {
      title: i18next.t("memberDetail.mis134"),
      align: 'center',
      children: [
        {
          title: i18next.t("col.bet"),
          dataIndex: "total_minigame_bet_today",
          key: "total_minigame_bet_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("global.user"),
          dataIndex: "total_minigame_user_today",
          key: "total_minigame_user_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
      ]
    },
    {
      title: i18next.t("title.fishingGame"),
      align: 'center',
      children: [
        {
          title: i18next.t("col.bet"),
          dataIndex: "total_fish_bet_today",
          key: "total_fish_bet_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("global.user"),
          dataIndex: "total_fish_user_today",
          key: "total_fish_user_today",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
      ]
    },
    {
      title: i18next.t("title.totalAlt"),
      align: 'center',
      children: [
        {
          title: i18next.t("col.bet"),
          dataIndex: "total_all_bet_today",
          key: "total_all_bet_today",
          align: "center",
          width: '6%',
          render: (_value, record) => {
            const sumAllBet = (record.total_live_bet_today || 0) + 
              (record.total_sports_bet_today || 0) +
              (record.total_slot_bet_today || 0) +
              (record.total_minigame_bet_today || 0) +
              (record.total_fish_bet_today || 0) +
              (record.total_esports_bet_today || 0);

            return <CommaNumber value={sumAllBet} />
          }
        },
        {
          title: i18next.t("global.user"),
          dataIndex: "total_unique_users",
          key: "total_unique_users",
          align: "center",
          width: '6%',
          render: (value) => <CommaNumber value={value} />
        },
      ]
    },
  ];

  return (
    <Table
      // bordered
      className="table-border-thick"
      sticky 
      columns={columnsArray}
      dataSource={data}
      tableLayout="auto"
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      loading={loading}
      pagination={false}
    />
  );
};

export default List;
