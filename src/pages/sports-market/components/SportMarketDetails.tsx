import i18next from "@/i18n/i18n";

import { MarketDetails, SportsMarketData, sportsMarketDetailsAPI } from "@/api/sport-market/get";
import CommaNumberSpan from "@/components/CommaNumberSpan";
import { Table, TableProps, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import dayjs from "dayjs";
import StatusTag from "./StatusTag";
import { useSearchParams } from "react-router-dom";

interface Props {
  parentRecord: SportsMarketData;
}

const SportMarketDetails = ({ parentRecord }: Props) => {
  const [searchParam, _] = useSearchParams();
  const [filter, setFilter] = useState<Record<string, any>>({
    filter_username: searchParam.get("filter_username"),
    filter_sports: parentRecord.sportsName,
    filter_league: parentRecord.leagueName,
    filter_matchname: parentRecord.matchName,
    filter_market: parentRecord.eventName,
    filter_matchdatetime: dayjs.tz(parentRecord.matchDateTime).format("YYYY-MM-DD HH:mm:ss"),
    orderby: "desc",
    columnby: "betAmount",
    page: 1,
    limit: 20,
  });  
  const { t } = useTranslation();
  const { data, isLoading, } = sportsMarketDetailsAPI(filter);

  const columns: TableProps<MarketDetails>["columns"] = [
    {
      title: t("col.market"),
      dataIndex: "eventName",
      align: "left",
      render: (value, record) => (
        <div className="">
          <span className="font-bold">{record.score}</span> - <span>{value}</span>
        </div>
      ),
    },
    // {
    //   title: t("col.handicap"),
    //   dataIndex: "benchMark",
    //   align: "center",
    //   render: (value) => (
    //     <div className="" style={{minWidth: 40}}>
    //       <span>{value}</span>
    //     </div>
    //   ),
    // },
    {
      title: t("col.handicapMemberBet"),
      dataIndex: "bettingName",
      align: "center",
    },
    {
      title: t("col.status"),
      dataIndex: "status",
      align: "center",
      render: (value) => (<StatusTag value={value} />),
    },
    {
      title: t("Odds"),
      dataIndex: "odds",
      key: "odds",
      align: "center",
    },
    {
      title: t("col.betAmount"),
      dataIndex: "betAmount",
      key: "betAmount",
      align: "center",
      render: (value) => <CommaNumberSpan value={Number(value)} />,
    },
    {
      title: t("col.expectedAmount"),
      dataIndex: "expectedWinAmount",
      key: "expectedWinAmount",
      align: "center",
      render: (value) => <CommaNumberSpan value={Number(value)} />,
    },
    {
      title: t("col.winningAmount"),
      dataIndex: "winAmount",
      key: "winAmount",
      align: "center",
      render: (value) => <CommaNumberSpan value={Number(value)} />,
    },
  ];

  return (
    <>
      <Typography.Title level={5}>{i18next.t("sportsMarket.betDetails")}</Typography.Title>
      <Table
        sticky
        columns={columns}
        dataSource={data?.data || []}
        tableLayout="auto"
        rowKey={(d) => `${d.bettingName}-${d.bettingScore}`}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        loading={isLoading}
        pagination={{
          current: filter.page,
          defaultPageSize: filter.limit,
          pageSize: filter.limit,
          total: data?.totalitems,
          onChange: (page: number) => {
            setFilter((prev) => ({
              ...prev,
              page
            }))
          },
        }}
      />
    </>
  );
};

export default SportMarketDetails;
