import i18next from "@/i18n/i18n";
import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import CommaNumber from "@/components/CommaNumber";
import { OnHeaderCellType } from "@/hooks/useSort";
import { PaginationProps } from "antd/lib";
import { BonusUsageData } from "@/api/cs-statics/bonus-usage";

interface Props {
  loading: boolean;
  data: BonusUsageData[] | undefined;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const newDataSource = data && data.length > 0 ? data.filter((item: BonusUsageData) => {
      if (item.bonus_amount !== 0 ||
        item.deposit_amount !== 0 ||
        item.bonus_count_application !== 0 ||
        item.bonus_count_used !== 0
      ) {
        return item
      }
    }) : [];

  const columnsArray: TableProps<BonusUsageData>["columns"] = [
    {
      title: 'No',
      align: "center",
      width: "5%",
      render: (_value, _record, index) => ((newDataSource?.length ?? 0) + 1) - (index + 1),
    },
    {
      title: t("col.depositBonusName"),
      dataIndex: "bonus_name",
      key: "bonus_name",
      align: "center",
      width: "25%",
      render: (value: string) => value ?? "-",
    },
    {
      title: t("col.bonusAmount"),
      dataIndex: "bonus_amount",
      key: "bonus_amount",
      align: "center",
      width: "11.6667%",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.depositAmount"),
      dataIndex: "deposit_amount",
      key: "deposit_amount",
      align: "center",
      width: "11.6667%",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.requestCount"),
      dataIndex: "bonus_count_application",
      key: "bonus_count_application",
      align: "center",
      width: "11.6667%",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.requestUsers"),
      dataIndex: "bonus_count_used",
      key: "bonus_count_used",
      align: "center",
      width: "11.6667%",
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
      dataSource={newDataSource}
      loading={loading}
      rowKey={"bonus_name"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
      summary={(data) => {
        let amountSum = 0;
        let amountDepositSum = 0;
        let counApplication = 0;
        let countUsed = 0;

        data.forEach((item) => {
          amountSum += item.bonus_amount ?? 0;
          amountDepositSum += item.deposit_amount  ?? 0;
          counApplication += item.bonus_count_application  ?? 0;
          countUsed += item.bonus_count_used  ?? 0;
        });

        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2} align="right" className="font-bold">{i18next.t("col.total")}</Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="center">{<CommaNumber value={amountSum} onlyNumber />}</Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center">{<CommaNumber value={amountDepositSum} onlyNumber />}</Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">{<CommaNumber value={counApplication} onlyNumber />}</Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="center">{<CommaNumber value={countUsed} onlyNumber />}</Table.Summary.Cell>
          </Table.Summary.Row>
        )
      }}
    />
  );
};

export default List;
