import { RevenueData } from "@/api/revenue/get";
import i18next from "@/i18n/i18n";
import { ResPostList } from "@/api/types";
import CommaNumber from "@/components/CommaNumber";
import DetailBtn from "@/components/DetailBtn";
import Percentage from "@/components/Percentage";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { parse, stringify } from "qs";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QueryData } from "./Filter";

interface Props {
  data?: ResPostList['data'];
  loading: boolean;
  userCount?: number;
}

const List = ({ data, loading, userCount }: Props) => {
  const { t } = useTranslation();
  const {id}= useParams()
  const { search } = useLocation();
  const navigate = useNavigate();

  const handleDetailBtn = ({vendor_id}: RevenueData) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    const username = query.username ? query.username.label : undefined;

    navigate({
      pathname: id ? `/user/${id}` : '/betting',
      search: stringify({
        tab: id ? 'bettingLog' : undefined,
        username: username ?? undefined,
        dateRange: id ? undefined : query.dateRangeT ? [query.dateRangeT[0], query.dateRangeT[1]] : undefined,
        dateRangeB: !id ? undefined : query.dateRangeT ? [query.dateRangeT[0], query.dateRangeT[1]] : undefined,
        game_id: vendor_id ? vendor_id : undefined
      })
    });
  };

  const newDataSource = data && data.length > 0 ? data.filter((item: RevenueData) => {
    if (item.total_bet_amount !== 0 ||
      item.total_win_amount !== 0 ||
      item.total_win_loss !== 0 ||
      item.total_bet_count !== 0 ||
      item.total_user_bet_count !== 0 ||
      item.rate !== 0 
    ) {
      return item
    }
  }) : [];

  const columnsArray: ColumnsType<RevenueData> = [
    {
      title: i18next.t("col.provider"),
      dataIndex: "vendor_id",
      key: "vendor_id",
      align: "center",
      render: (value, record) => `${value} - ${record.game_category}`,
    },
    {
      title: t("col.bet"),
      dataIndex: "total_bet_amount",
      key: "total_bet_amount",
      align: "center",
      sorter: (a, b) => a.total_bet_amount - b.total_bet_amount,
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("col.win"),
      dataIndex: "total_win_amount",
      key: "total_win_amount",
      align: "center",
      sorter: (a, b) => a.total_win_amount - b.total_win_amount,
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("col.profitLoss"),
      dataIndex: "total_win_loss",
      key: "total_win_loss",
      align: "center",
      sorter: (a, b) => a.total_win_loss - b.total_win_loss,
      render: (value: number | undefined) => <CommaNumber value={value} />,
    },
    {
      title: t("col.betCount"),
      dataIndex: "total_bet_count",
      key: "total_bet_count",
      align: "center",
      sorter: (a, b) => a.total_bet_count - b.total_bet_count,
      render: (value: number | undefined) => <CommaNumber value={value} />,
    },
    {
      title: t("col.bettingUsers"),
      dataIndex: "total_user_bet_count",
      key: "total_user_bet_count",
      align: "center",
      sorter: (a, b) => a.total_user_bet_count - b.total_user_bet_count,
      render: (value: number | undefined) => <CommaNumber value={value} />,
    },
    {
      title: t("col.payoutRate"),
      dataIndex: "rate",
      key: "rate",
      align: "center",
      sorter: (a, b) => a.rate - b.rate,
      render: (value: number | undefined) => <Percentage value={(value ?? 0)} />,
    },
    {
      title: t("col.viewDetails"),
      fixed: "right",
      key: "action",
      align: "center",
      render: (_, record) => <DetailBtn onClick={() => handleDetailBtn(record)}  />,
    },
  ];

  // const columns = columnsArray.map((item) =>
  //   item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  // );
  const columns = id ? columnsArray.filter(item => item.key !== 'total_user_bet_count') : columnsArray


  return (
    <Table
      sticky
      columns={columns}
      dataSource={newDataSource}
      loading={loading}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={false}
      summary={(data) => {
        let betAmountSum = 0;
        let winAmountSum = 0;
        let winLossSum = 0;
        let betCountSum = 0;
        let userBetCountSum = 0;
        let rateSum = 0

        data.forEach((item) => {
          betAmountSum += item.total_bet_amount ?? 0;
          winAmountSum += item.total_win_amount  ?? 0;
          winLossSum += item.total_win_loss  ?? 0;
          betCountSum += item.total_bet_count  ?? 0;
          userBetCountSum += item.total_user_bet_count  ?? 0;
        });

        // rateSum = ((winAmountSum / betAmountSum) * 100)
        rateSum = ((winLossSum / betAmountSum) * 100)

        return (
          <Table.Summary.Row className="font-bold">
            <Table.Summary.Cell index={0} align="center">{i18next.t("col.total")}</Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="center">{<CommaNumber value={betAmountSum} onlyNumber />}</Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center">{<CommaNumber value={winAmountSum} onlyNumber />}</Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">{<CommaNumber value={winLossSum} onlyNumber />}</Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="center">{<CommaNumber value={betCountSum} onlyNumber />}</Table.Summary.Cell>
            { !id && (
              <Table.Summary.Cell index={5} align="center">{<CommaNumber value={userCount} onlyNumber />}</Table.Summary.Cell>
            )}
            <Table.Summary.Cell index={6} align="center">{<Percentage value={rateSum} />}</Table.Summary.Cell>
            <Table.Summary.Cell index={7} align="center"></Table.Summary.Cell>
          </Table.Summary.Row>
        )
      }}
    />
  );
};

export default List;
