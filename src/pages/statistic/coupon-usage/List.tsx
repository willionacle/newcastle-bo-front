import i18next from "@/i18n/i18n";
import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import CommaNumber from "@/components/CommaNumber";
import { OnHeaderCellType } from "@/hooks/useSort";
import { PaginationProps } from "antd/lib";
import { CombinedUsageData } from "@/api/cs-statics/coupon-usage";
import { GF } from "@/utils/GlobalFunctions";
interface Props {
  loading: boolean;
  data: CombinedUsageData[] | undefined;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
  totals: any;
}

const List = ({ data, loading, onHeaderCell, pagination, totals }: Props) => {
  const { t } = useTranslation();

  const newDataSource =
    data && data.length > 0
      ? data.map((item: CombinedUsageData) => ({
            ...item,
            name:
              item.type === "wheel"
                ? GF.handleGradeStrVal(item.grade)
                : item.name,
          })).filter((item: CombinedUsageData) => {
            const amount = item.amount || 0;
            const usageCount =
              item.type === "wheel" ? item.usage_count : item.usageCount;
            const userCount =
              item.type === "wheel" ? item.user_count : item.userCount;

            if (amount !== 0 || usageCount !== 0 || userCount !== 0) {
              return item;
            }
          })
      : [];


  const columnsArray: TableProps<CombinedUsageData>["columns"] = [
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (newDataSource?.length ?? 0) + 1 - (index + 1),
    },
    {
      title: t("col.category"),
      align: "center",
      render: (_value, record) => (record.type === "wheel" ? i18next.t("storeSetting.ss007") : i18next.t("topNavi.tn030")),
    },
    {
      title: t("col.couponNameGrade"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "wheel") {
          return `${GF.handleGradeStrVal(record.grade)}`;
        }
        return record.name ?? "-";
      },
    },
    {
      title: t("col.couponContent"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "wheel") {
          return "-";
        }
        return record.couponContent ?? "-";
      },
    },
    {
      title: t("col.usedAmount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} onlyNumber />,
    },
    {
      title: t("col.usageCount"),
      align: "center",
      render: (_value, record) => {
        const count =
          record.type === "wheel" ? record.usage_count : record.usageCount;
        return <CommaNumber value={count} onlyNumber />;
      },
    },
    {
      title: t("col.usersUsed"),
      align: "center",
      render: (_value, record) => {
        const count =
          record.type === "wheel" ? record.user_count : record.userCount;
        return <CommaNumber value={count} onlyNumber />;
      },
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
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
      summary={(_data) => {
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell
              index={0}
              colSpan={4}
              align="right"
              className="font-bold"
            >
              {i18next.t("col.total")}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="center">
              <CommaNumber value={totals?.amount} onlyNumber />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center">
              <CommaNumber value={totals?.usageCount} onlyNumber />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              <CommaNumber value={totals?.userCount} onlyNumber />
            </Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export default List;
