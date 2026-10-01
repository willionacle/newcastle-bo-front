
import { SportsMarketData } from "@/api/sport-market/get";
import { ResPostList, SWRType } from "@/api/types";
import CommaNumberSpan from "@/components/CommaNumberSpan";
import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";
import OpenSettledAmounts from "../components/OpenSettledAmounts";
import SportMarketDetails from "../components/SportMarketDetails";
import dayjs from "dayjs";

interface Props {
  data: ResPostList["data"];
  loading: boolean;
  totalitems?: number;
  mutate: KeyedMutator<SWRType<SportsMarketData[]>>;
  filter: Record<string, any>;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

export const handleTextColor = (x: number | string, bluePositive = false) => {
    return Number(x) < 0 ? 'var(--ant-color-error-text)' : bluePositive ? 'var(--ant-color-info-text)' : '';
}

const List = ({ data, loading, totalitems, filter, setFilter }: Props) => {
  const { t } = useTranslation();

  const columns: TableProps<SportsMarketData>["columns"] = [
    {
      title: t("col.sport"),
      dataIndex: "sportsName",
      key: "sportsName",
      align: "center",
    },
    {
      title: t("col.date"),
      dataIndex: "matchDateTime",
      key: "matchDateTime",
      align: "center",
      // render: (value) => <DateText date={value} timeStamp />,
      render: (value) => dayjs(value).format("YY-MM-DD HH:mm:ss"),
    },
    {
      title: t("col.league"),
      dataIndex: "leagueName",
      key: "leagueName",
      align: "center",
    },
    Table.EXPAND_COLUMN,
    {
      title: t("col.betTotal"),
      dataIndex: "betSum",
      key: "betSum",
      align: "center",
      render: (value: number, record) => {

        return (
          <div className="font-bold">
            <div><CommaNumberSpan value={Number(value)} /></div>
            <div><CommaNumberSpan value={Number(record.settled_winSum)} /></div>
          </div>
        );
      },
    },
    {
      title: t("col.home"),
      dataIndex: "homeName",
      key: "homeName",
      align: "center",
      render: (_, record) => (
        <OpenSettledAmounts
          teamSide="home"
          record={record}
          clickable
        />
      ),
    },
    {
      title: t("VS"),
      align: "center",
      render: (_, record) => (
        <OpenSettledAmounts
          teamSide="draw"
          record={record}
          clickable
        />
      ),
    },
    {
      title: t("col.away"),
      dataIndex: "awayName",
      key: "awayName",
      align: "center",
      render: (_, record) => (
        <OpenSettledAmounts
          teamSide="away"
          record={record}
          clickable
        />
      ),
    },
  ];


  return (
    <Table
      sticky
      columns={columns}
      dataSource={data}
      expandable={{
        expandedRowRender: (record) => <SportMarketDetails parentRecord={record} />,
      }}
      tableLayout="auto"
      rowKey={(d) => `${d.matchName}-${d.eventName}-${d.matchDateTime}`}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      loading={loading}
      pagination={{
        current: filter.page,
        defaultPageSize: filter.limit,
        pageSize: filter.limit,
        total: totalitems,
        pageSizeOptions: [10, 50, 100, 300, 500],
        onChange: (page: number) => {
          setFilter((prev) => ({
            ...prev,
            page
          }))
        },
        onShowSizeChange: (_current: number, limit: number) => {
          setFilter((prev) => ({
            ...prev,
            page: 1,
            limit,
          }))
        },
      }}
    />
  );
};

export default List;
