import { DailyStatsTabData } from "@/api/cs-statics/user-daily-stats-tab";
import { CompressedUserStatsTotalSummary } from "@/api/dailystats-gamesumm/get";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";

import { useTranslation } from "react-i18next";

interface Props {
  loading: boolean;
  data: DailyStatsTabData[] | undefined;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
  totals?: CompressedUserStatsTotalSummary | undefined
}

const List = ({ data, loading, onHeaderCell, pagination,totals }: Props) => {
  const { t } = useTranslation();

  const safeData = Array.isArray(data) ? data : [];

  const columnsArray: TableProps<DailyStatsTabData>["columns"] = [
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => ((safeData.length ?? 0) + 1) - (index + 1),
    },
    {
      title: t("dailyStatistics.ds001"),
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (value) => <DateText date={value} />,
    },
    {
      title: t("dailyStatistics.ds006"),
      dataIndex: "depositSum",
      key: "depositSum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.depositCount"),
      dataIndex: "depositCount",
      key: "depositCount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("dailyStatistics.ds007"),
      dataIndex: "withdrawalSum",
      key: "withdrawalSum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.withdrawalCount"),
      dataIndex: "withdrawalCount",
      key: "withdrawalCount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("dailyStatistics.ds008"),
      dataIndex: "netDeposit",
      key: "netDeposit",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("dailyStatistics.ds009"),
      dataIndex: "betSum",
      key: "betSum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("dailyStatistics.ds010"),
      dataIndex: "winSum",
      key: "winSum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("dailyStatistics.ds011"),
      dataIndex: "netBet",
      key: "netBet",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.bonusTotal"),
      dataIndex: "totalBonusSum",
      key: "totalBonusSum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("dailyStatistics.ds012"),
      dataIndex: "rollingPointSum",
      key: "rollingPointSum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    // {
    //   title: t("dailyStatistics.ds014"),
    //   dataIndex: "new_user_count",
    //   key: "new_user_count",
    //   align: "center",
    //   render: (value: number) => <CommaNumber value={value} onlyNumber />,
    // },
    // {
    //   title: t("dailyStatistics.ds015"),
    //   dataIndex: "betting_user_count",
    //   key: "date",
    //   align: "center",
    //   render: (value: number) => <CommaNumber value={value} onlyNumber />,
    // },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      columns={columns}
      dataSource={safeData}
      loading={loading}
      rowKey={"date"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
      summary={(_pageData) => {
        return (
          <Table.Summary fixed={"top"}>
            <Table.Summary.Row
              style={{
                background: "var(--ant-table-row-hover-bg)",
              }}
            >
              <Table.Summary.Cell colSpan={2} index={1} align="center">
                {t("global.sum")}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center">
                <CommaNumber
                  value={totals?.depositSum}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.depositSum,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center">
                <CommaNumber
                  value={totals?.depositCount}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.depositCount,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center">
                <CommaNumber
                  value={totals?.withdrawalSum}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.withdrawalSum,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center">
                <CommaNumber
                  value={totals?.withdrawalCount}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.withdrawalCount,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="center">
                <CommaNumber
                  value={totals?.netDeposit}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.netDeposit,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="center">
                <CommaNumber
                  value={totals?.betSum}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.betSum,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={11} align="center">
                <CommaNumber
                  value={totals?.winSum}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.winSum,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={15} align="center">
                <CommaNumber
                  value={totals?.netBet}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.netBet,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={16} align="center">
                <CommaNumber
                  value={totals?.totalBonusSum}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.totalBonusSum,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={17} align="center">
                <CommaNumber
                  value={totals?.rollingPointSum}
                  // value={pageData.reduce(
                  //   (prev, current) => prev + current.rollingPointSum,
                  //   0
                  // )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              {/* <Table.Summary.Cell index={20} align="center">
                <CommaNumber
                  value={pageData.reduce(
                    (prev, current) => prev + current.new_user_count,
                    0
                  )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={21} align="center">
                <CommaNumber
                  value={pageData.reduce(
                    (prev, current) => prev + current.betting_user_count,
                    0
                  )}
                  onlyNumber
                />
              </Table.Summary.Cell> */}
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
};

export default List;
