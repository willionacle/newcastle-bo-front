import { DailyUSDTStatsData } from "@/api/cs-statics/usdt-stats";
import CommaNumber from "@/components/CommaNumber";
import CommaNumber2 from "@/components/CommaNumber2";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";

import { useTranslation } from "react-i18next";

interface Props {
  loading: boolean;
  data: DailyUSDTStatsData[] | undefined;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
  totals: any
}

const List = ({ data, totals, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<DailyUSDTStatsData>["columns"] = [
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
      title: t("col.depositKrw"),
      dataIndex: "deposit_sum",
      key: "deposit_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.exchangeRate"),
      dataIndex: "exchange_rate",
      key: "exchange_rate",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.depositUsdt"),
      dataIndex: "deposit_sum_usdt",
      key: "deposit_sum_usdt",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} />,
    },
    {
      title: t("col.withdrawalAmount"),
      dataIndex: "withdrawal_sum",
      key: "withdrawal_sum",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.avgExchangeRate"),
      dataIndex: "exchange_rate",
      key: "exchange_rate",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.withdrawalUsdt"),
      dataIndex: "withdrawal_sum_usdt",
      key: "withdrawal_sum_usdt",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} />,
    },
    {
      title: t("col.netKrw"),
      dataIndex: "winlose",
      key: "winlose",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.netUsdt"),
      dataIndex: "winlose_usdt",
      key: "winlose_usdt",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} />,
    },
    {
      title: t("col.activeUser"),
      dataIndex: "unique_user_count",
      key: "unique_user_count",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky 
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={"date"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
      summary={(pageData) => {
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
                  value={pageData.reduce(
                    (prev, current) => prev + current.deposit_sum,
                    0
                  )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center">
                <CommaNumber
                  value={totals?.total_exchange_rate || 0}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center">
                <CommaNumber2
                  value={pageData.reduce(
                    (prev, current) => prev + current.deposit_sum_usdt,
                    0
                  )}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center">
                <CommaNumber
                  value={pageData.reduce(
                    (prev, current) => prev + current.withdrawal_sum,
                    0
                  )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="center">
                <CommaNumber
                  value={totals?.total_average_exchange_rate || 0}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="center">
                <CommaNumber2
                  value={
                    pageData.reduce(
                      (prev, current) => prev + current.withdrawal_sum_usdt,
                      0
                    )
                  }
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={11} align="center">
                <CommaNumber
                  value={pageData.reduce(
                    (prev, current) => prev + current.winlose,
                    0
                  )}
                  onlyNumber
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={11} align="center">
                <CommaNumber2
                  value={pageData.reduce(
                    (prev, current) => prev + current.winlose_usdt,
                    0
                  )}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={15} align="center">
                <CommaNumber
                  value={totals?.total_deposit_count || 0}
                  onlyNumber
                />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
};

export default List;
