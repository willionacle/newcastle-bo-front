import i18next from "@/i18n/i18n";
import CommaNumber from "@/components/CommaNumber";
import { Table, TableProps, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { BetDetailsProp } from "../../List";
import { BetDetailsData } from "../../types";
import { handleStatusTagProps } from "../handlers";
import DateTextKR from "@/components/DateTextKR";

interface Prop {
  data?: BetDetailsProp['bet_details']
}

const BetDetail = ({ data }: Prop) => {
  const { t } = useTranslation();
  console.log('DEETS', data)
  const columnsArray: TableProps<BetDetailsData>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      align: "center",
    },
    {
      title: t("col.sport"),
      dataIndex: "tbxi_item_name",
      align: "center",
    },
    {
      title: t("col.league"),
      dataIndex: "tbxi_league_name",
      align: "center",
    },
    {
      title: t("col.match"),
      dataIndex: "tbxi_match_name",
      align: "center",
    },
    {
      title: t("col.gameName"),
      dataIndex: "tbxi_event_name",
      align: "center",
    },
    {
      title: t("col.home"),
      dataIndex: "tbxi_home_name",
      align: "center",
    },
    {
      title: t("col.finalScore"),
      dataIndex: "tbxi_score",
      align: "center",
    },
    {
      title: t("col.betTimeScore"),
      dataIndex: "tbxi_betting_score",
      align: "center",
    },
    {
      title: t("col.away"),
      dataIndex: "tbxi_away_name",
      align: "center",
    },
    {
      title: t("col.memberBetName"),
      dataIndex: "tbxi_betting_name",
      align: "center",
    },
    {
      title: t("col.betValue"),
      dataIndex: "tbxi_betval",
      align: "center",
    },
    {
      title: t("col.betValue"),
      dataIndex: "tbxi_betval",
      align: "center",
    },
    {
      title: t("col.odds"),
      dataIndex: "tbxi_allocation",
      align: "center",
      render: (value) => <Tag color="default">{Number(value).toFixed(2)}</Tag>
    },
    {
      title: t("col.handicap"),
      dataIndex: "tbxi_bechmark",
      align: "center",
      render: (value) => <CommaNumber value={value} />
    },
    {
      title: t("col.isLive"),
      dataIndex: "tbxi_match_type",
      align: "center",
      render: (value) => <Tag color={value == 1 ? "success": "warning"}>{value == 1 ? i18next.t("title.live") : i18next.t("betting.prematch")}</Tag>
    },
    {
      title: t("col.result"),
      dataIndex: "tbxi_status",
      align: "center",
      render: (value) => <Tag color={handleStatusTagProps(value).color}>{handleStatusTagProps(value).str}</Tag>
    },
    {
      title: t("col.matchDate"),
      dataIndex: "tbxi_match_time",
      align: "center",
      render: (value: string) => <DateTextKR date={`${value}Z`} timeStamp />,
    },
  ];

  return (
    <>
      <Table
      sticky
        columns={columnsArray}
        dataSource={data}
        tableLayout="auto"
        rowKey={"id"}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={false}
      />
    </>
  );
};

export default BetDetail;
