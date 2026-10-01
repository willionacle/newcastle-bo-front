import i18next from "@/i18n/i18n";

import { MarketEventDetails, SportsMarketData, sportsMarketEventDetailsAPI } from "@/api/sport-market/get";
import CommaNumberSpan from "@/components/CommaNumberSpan";
import { Table, TableProps } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import StatusTag from "./StatusTag";

interface Props {
  parentRecord: SportsMarketData;
  teamSide: "home" | "away" | "draw";
}

const SportMarketEventDetails = ({ parentRecord, teamSide }: Props) => {
  const [filter, setFilter] = useState<Record<string, any>>({
    filter_sports: parentRecord.sportsName,
    filter_league: parentRecord.leagueName,
    filter_matchname: parentRecord.matchName,
    filter_market: parentRecord.eventName,
    filter_side: teamSide,
    filter_matchdatetime: dayjs.tz(parentRecord.matchDateTime).format("YYYY-MM-DD HH:mm:ss"),
    orderby: "desc",
    columnby: "betAmount",
    page: 1,
    limit: 20,
  });  
  const { data, isLoading, } = sportsMarketEventDetailsAPI(filter);

  const columns: TableProps<MarketEventDetails>["columns"] = [
    {
      dataIndex: "bettingName",
      align: "left",
    },
    {
      dataIndex: "status",
      align: "center",
      render: (value) => (<StatusTag value={value} />),
    },
    {
      dataIndex: "odds",
      key: "odds",
      align: "left",
    },
    {
      dataIndex: "betAmount",
      key: "betAmount",
      align: "left",
       render: (value) => (
        <div className="">
          <div className="" style={{ color: "var(--ant-color-error-text)"}}>{i18next.t("sportsMarket.betAmount")}</div>
          <div className="">
            <CommaNumberSpan value={Number(value)} />
          </div>
        </div>
      ),
    },
    {
      dataIndex: "expectedWinAmount",
      key: "expectedWinAmount",
      align: "left",
      render: (value, record) => (
        <div className="">
          {record.status === "Opened" ? (
            <>
              <div className="" style={{ color: "var(--ant-color-info-text)"}}>{i18next.t("col.expectedAmount")}</div>
              <div className="">
                <CommaNumberSpan value={Number(value)} />
              </div>
            </>
          ) : (
            <>
              <div className="" style={{ color: "var(--ant-color-success-text)"}}>{i18next.t("sportsMarket.winnings")}</div>
              <div className="">
                <CommaNumberSpan value={Number(record.winAmount)} />
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        showHeader={false}
        columns={columns}
        dataSource={data?.data || []}
        tableLayout="auto"
        rowKey={(d) => `${d.bettingName}-${d.matchDateTime}`}
        scroll={{ x: 500, y: 300 }}
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

export default SportMarketEventDetails;
