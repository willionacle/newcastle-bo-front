import { OnHeaderCellType } from "@/hooks/useSort";
import i18next from "@/i18n/i18n";
import { Modal, notification, Switch, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { Row } from "@/components/DraggableTableRow/Row";
import { useState } from "react";
import { MatchData } from "@/api/stream-community/get";
import DateText from "@/components/DateText";
import { PaginationProps } from "antd/lib";
import useUserStore from "@/store/user.store";
import { api } from "@/api/axios";
import MatchDetails from "./components/MatchDetails";
import DetailBtn from "@/components/DetailBtn";

interface Props {
  data: MatchData[];
  loading: boolean;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
  pagination: PaginationProps;
}

const List = ({ data, onHeaderCell, loading, mutate, pagination }: Props) => {
  const { token } = useUserStore.getState();
  const { t } = useTranslation();
  const [selectedMatch, setSelectedMatch] = useState<MatchData | undefined>(
    undefined
  );

  const handleChangePopular = async (e: boolean, record: MatchData) => {
    try {
      const reqBody = {
        id: record.id,
        is_on: e ? 1 : 0,
      };

      const res = await api.toggleStream(reqBody, token);

      const {
        data: { code },
      } = res;
      if (code === 0) {
        notification.success({
          message: t("global.success"),
          duration: 1,
          type: "success",
        });
        mutate();
      } else {
        notification.error({
          message: t("global.error"),
          duration: 1,
          type: "success",
        });
      }
    } catch (error) {
      notification.error({
        message: t("global.fail"),
      });
    }
  };

  const columnsArr: TableProps["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_value, _record, index) => (index ?? 0) + 1,
    },
    {
      title: "Match ID",
      dataIndex: "MatchID",
      key: "MatchID",
      align: "center",
      hidden: true,
    },
    {
      title: "Bid",
      dataIndex: "bid",
      key: "bid",
      align: "center",
    },
    {
      title: i18next.t("col.sport"),
      dataIndex: "Type",
      key: "",
      align: "center",
    },
    {
      title: i18next.t("title.matchup"),
      dataIndex: "Name",
      key: "",
      align: "center",
    },
    {
      title: i18next.t("col.leagueName"),
      dataIndex: "League",
      key: "League",
      align: "center",
    },
    {
      title: i18next.t("col.homeTeam"),
      dataIndex: "Home",
      key: "",
      align: "center",
    },
    {
      title: i18next.t("col.awayTeam"),
      dataIndex: "Away",
      key: "",
      align: "center",
    },
    {
      title: i18next.t("title.homeScore"),
      dataIndex: "HomeScore",
      key: "",
      align: "center",
      width: 100,
      render: (value: string) => value || "-",
    },
    {
      title: i18next.t("title.awayScore"),
      dataIndex: "AwayScore",
      key: "",
      align: "center",
      width: 100,
      render: (value: string) => value || "-",
    },
    {
      title: i18next.t("title.inProgress"),
      dataIndex: "NowPlaying",
      key: "NowPlaying",
      width: 120,
      align: "center",
      render: (value: boolean) =>
        value ? (
          <span style={{ color: "green", fontWeight: 600 }}>{i18next.t("title.live")}</span>
        ) : (
          <span style={{ color: "orange" }}>{i18next.t("status.waiting")}</span>
        ),
    },
    {
      title: i18next.t("title.startTime"),
      dataIndex: "TimeStart",
      key: "TimeStart",
      render: (value: string) => <DateText date={value} timeStamp/>,
      align: "center",
    },
    {
      title: i18next.t("title.endTime"),
      dataIndex: "TimeStop",
      key: "TimeStop",
      render: (value: string) => <DateText date={value} timeStamp/>,
      align: "center",
    },
    {
      title: "Live",
      dataIndex: "IsLive",
      key: "IsLive",
      align: "center",
      render: (value: boolean) =>
        value ? (
          <span style={{ color: "red", fontWeight: 600, whiteSpace: "nowrap" }}>
            ● LIVE
          </span>
        ) : (
          <span style={{ color: "orange" }}>WAITING</span>
        ),
      hidden: true
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "State",
      key: "",
      align: "center",
      render: (value: string) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {value === "resume" ? i18next.t("system.resumeMatch") : i18next.t("status.stopped")}
        </span>
      ),
    },
    {
      title: t("col.showHide"),
      dataIndex: "is_on",
      key: "",
      align: "center",
      fixed: "right",
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangePopular(e, record)}
        />
      ),
    },
    {
      title: t("col.detail"),
      key: "",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <DetailBtn onClick={() => setSelectedMatch(record)} />
      ),
    },
  ];

  const columns = columnsArr.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <>
      <Table
        sticky
        columns={columns}
        dataSource={data}
        rowKey={"id"}
        components={{ body: { row: Row } }}
        tableLayout="auto"
        loading={loading}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
      />
      <Modal
        open={selectedMatch as any}
        onCancel={() => setSelectedMatch(undefined)}
        footer={null}
        width={1000}
        centered
        title={i18next.t("title.matchDetails")}
      >
        <MatchDetails matchData={selectedMatch} />
      </Modal>
    </>
  );
};

export default List;
