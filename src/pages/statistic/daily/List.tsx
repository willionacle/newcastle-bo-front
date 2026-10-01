import { DailyStatsData, DailyStatsTotals } from "@/api/cs-statics/daily-stats";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps, Tooltip } from "antd";
import { PaginationProps } from "antd/lib";
import commaNumber from "comma-number";

import { useTranslation } from "react-i18next";

interface Props {
  loading: boolean;
  data: DailyStatsData[] | undefined;
  totals: DailyStatsTotals | undefined;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
}

const List = ({ data, totals, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<DailyStatsData>["columns"] = [
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => ((data?.length ?? 0) + 1) - (index + 1),
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
      render: (value: number) => <CommaNumber value={value} onlyNumber />
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
      title: t("col.depositBonusCoupon"),
      dataIndex: "totalBonusSum",
      key: "totalBonusSum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      // 출석보너스는 입플&쿠폰에 이미 포함된 금액이라 합산하면 이중 계산이 된다.
      title: (
        <Tooltip title={t("dailyStatistics.ds019")}>
          {t("moneyType.attendanceBonus")}
        </Tooltip>
      ),
      dataIndex: "attendanceBonusSum",
      key: "attendanceBonusSum",
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
    {
      title: t("col.newReferral"),
      dataIndex: "newUserCount",
      key: "newUserCount",
      align: "center",
      render: (value: number, record) => `${commaNumber(value)} (${record.referredUser ?? 0})`,
    },
    {
      title: t("col.depositUser"),
      dataIndex: "depositUserCount",
      key: "depositUserCount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("dailyStatistics.ds015"),
      dataIndex: "bettingUserCount",
      key: "bettingUserCount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.returningUser"),
      dataIndex: "returneeUser",
      key: "returneeUser",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
  ];

  // 백엔드 정렬(columnby)이 지원하지 않는 컬럼은 헤더 클릭을 붙이지 않는다.
  const nonSortableKeys = ["action", "attendanceBonusSum"];

  const columns = columnsArray.map((item) =>
    item.key && !nonSortableKeys.includes(item.key as string)
      ? { ...item, onHeaderCell }
      : item
  );

  return (
    <Table
      sticky
      // @ts-ignore
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={"date"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
      summary={(pageData) => {
        if (!totals) return null;

        return (
          <Table.Summary fixed={"top"}>
            <Table.Summary.Row
              className="font-bold"
              style={{
                background: "var(--ant-table-row-hover-bg)",
              }}
            >
              <Table.Summary.Cell colSpan={2} index={1} align="center">
                {t("col.average")}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.depositSum || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.depositCount || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.withdrawalSum || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.withdrawalCount || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.netDeposit || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.betSum || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={11} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.withdrawalSum || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={15} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.netBet || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={16} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.totalBonusSum || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={17} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.attendanceBonusSum || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={18} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.rollingPointSum || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={20} align="center">
                <div style={{display:"flex",justifyContent:"center", gap:"2px"}}>
                  <CommaNumber value={pageData.reduce((prev, current) => prev + (current.newUserCount || 0), 0) / (pageData?.length || 0)} onlyNumber />{" "}
                  (<CommaNumber value={pageData.reduce((prev, current) => prev + (current.referredUser || 0), 0) / (pageData?.length || 0)} />)
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={20} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.depositUserCount || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={21} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.bettingUserCount || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={22} align="center">
                <CommaNumber value={pageData.reduce((prev, current) => prev + (current.returneeUser || 0), 0) / (pageData?.length || 0)} onlyNumber />
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row
              style={{
                background: "var(--ant-table-row-hover-bg)",
              }}
            >
              <Table.Summary.Cell colSpan={2} index={1} align="center">
                {t("global.sum")}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center">
                <CommaNumber value={totals.depositSum} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center">
                <CommaNumber value={totals.depositCount} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center">
                <CommaNumber value={totals.withdrawalSum} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center">
                <CommaNumber value={totals.withdrawalCount} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="center">
                <CommaNumber value={totals.netDeposit} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="center">
                <CommaNumber value={totals.betSum} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={11} align="center">
                <CommaNumber value={totals.winSum} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={15} align="center">
                <CommaNumber value={totals.netBet} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={16} align="center">
                <CommaNumber value={totals.totalBonusSum} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={17} align="center">
                <CommaNumber value={totals.attendanceBonusSum} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={18} align="center">
                <CommaNumber value={totals.rollingPointSum} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={20} align="center">
                <div style={{display:"flex",justifyContent:"center", gap:"2px"}}>
                  <CommaNumber value={totals.newUserCount} onlyNumber />{" "}
                  ({commaNumber(totals.referredUser)})
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={20} align="center">
                <CommaNumber value={totals.depositUserCount} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={21} align="center">
                <CommaNumber value={totals.bettingUserCount} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={22} align="center">
                <CommaNumber value={totals.returneeUser} onlyNumber />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
      rowClassName={(record) => record.isAvg? "font-bold" : ""}
    />
  );
};

export default List;
