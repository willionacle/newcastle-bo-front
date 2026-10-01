import i18next from "@/i18n/i18n";
import CommaNumber from "@/components/CommaNumber";
import { Table, TableProps, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { handleStatusTagProps } from "../handlers";
import DateTextKR from "@/components/DateTextKR";
import { BetDetailsProp } from "../../../List";
import { BetDetailsData } from "../../../types";
import { BetLogData } from "@/api/betting-logs/get";

interface Prop {
  data?: BetDetailsProp['bet_details']
  record?: BetLogData
}

const BetDetail = ({ data,record }: Prop) => {
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
    // {
    //   title: t("col.match"),
    //   dataIndex: "tbxi_match_name",
    //   align: "center",
    // },
    {
      title: t("col.match"),
      dataIndex: "tbxi_match_name",
      align: "center",
      render: (value: string) => {
        const match = record?.match_color_name?.find(
          (m) => m.name === value
        );

        return (
          <span
            style={{
              color: match?.color || "inherit",
              fontWeight: match ? 600 : "normal",
            }}
          >
            {value}
          </span>
        );
      },
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
      render: (value) => <Tag color="default">{value}</Tag>
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

  const totalOdds = (data ?? []).reduce(
    (acc, leg) => acc * (Number(leg.tbxi_allocation) || 1),
    1
  );

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
        summary={() =>
          data && data.length > 0 ? (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row className="font-bold" style={{ backgroundColor: "#f0f1f7" }}>
                <Table.Summary.Cell index={0} colSpan={12} align="right">
                  {i18next.t("col.total")}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  <Tag color="default">{totalOdds.toFixed(2)}</Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={4}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          ) : null
        }
      />
    </>
  );
};

export default BetDetail;
