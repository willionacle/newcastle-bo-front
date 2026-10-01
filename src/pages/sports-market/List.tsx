import i18next from "@/i18n/i18n";

import { SportsMarketData } from "@/api/sport-market/get";
import { ResPostList, SWRType } from "@/api/types";
import CommaNumberSpan from "@/components/CommaNumberSpan";
import { OnHeaderCellType } from "@/hooks/useSort";
import { EyeFilled } from "@ant-design/icons";
import { Button, Divider, Modal, Table, TableProps, Tag } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";
import OpenSettledAmounts from "./components/OpenSettledAmounts";
import SportMarketDetails from "./components/SportMarketDetails";
import { useState } from "react";
import SportsMarketEvent from "./market-event/SportsMarketEvent";
import dayjs from "dayjs";

interface Props {
  data: ResPostList["data"];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<SportsMarketData[]>>;
  totals?: any
}

const matchStatusColor: Record<string, Record<string, string | undefined>> = {
  "Waiting": {
    color: "blue",
    text: i18next.t("status.waiting"),
  },
  "On-Going": {
    color: "yellow",
    text: i18next.t("status.ongoing"),
  },
  "Finished": {
    color: undefined,
    text: i18next.t("sports.closed"),
  },
}

export const handleTextColor = (x: number | string, bluePositive = false) => {
    return Number(x) < 0 ? 'var(--ant-color-error-text)' : bluePositive ? 'var(--ant-color-info-text)' : '';
}

const List = ({ data, loading, pagination, onHeaderCell }: Props) => {
  const [parentRecord, setParentRecord] = useState<SportsMarketData | undefined>();
  const { t } = useTranslation();

  const columnsArray: TableProps<SportsMarketData>["columns"] = [
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
    {
      title: t("col.status"),
      dataIndex: "matchStatus",
      key: "matchStatus",
      align: "center",
      render: (value) => <Tag color={matchStatusColor[value]?.color} >{matchStatusColor[value]?.text}</Tag>,
    },
    {
      title: t("col.finalScore"),
      dataIndex: "score",
      key: "score",
      align: "center",
      width: 70,
    },
    Table.EXPAND_COLUMN,
    {
      title: t("col.market"),
      align: "center",
      render: (_, record) => (
        <Button
          icon={<EyeFilled />}
          size={"small"}
          onClick={() => setParentRecord(record)}
        >
          상세 마켓
        </Button>
      ),
    },
    {
      title: t("col.betTotal"),
      dataIndex: "betSum",
      key: "betSum",
      align: "center",
      render: (value: number, record) => {
        const isWaiting = record.matchStatus === "Waiting";
        const profit = Number(record.betSum) - Number(record.settled_winSum);

        return (
          <div className="font-bold">
            <div><CommaNumberSpan value={Number(value)} /></div>

            {record.matchStatus === "Finished" && (
              <>
                <div><CommaNumberSpan value={Number(record.settled_winSum)} /></div>
                {isWaiting ? (
                  <div>0</div>
                ) : (
                  <div style={{ color: handleTextColor(profit, true) }}>
                    <CommaNumberSpan value={profit} />
                  </div>
                )}
              </>
            )}
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
        />
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <>
      <Table
        sticky
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => <SportMarketDetails parentRecord={record} />,
        }}
        tableLayout="auto"
        rowKey={(d) => `${d.matchName}-${d.matchDateTime}`}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        loading={loading}
        pagination={pagination}
      />
      <Modal
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        destroyOnClose
        open={parentRecord ? true : false}
        onCancel={() => setParentRecord(undefined)}
        centered
        width={"80%"}
        title={parentRecord?.matchName}
      >
        <Divider />
        {parentRecord && (
          <SportsMarketEvent parentRecord={parentRecord} />
        )}
      </Modal>
    </>
  );
};

export default List;
