import i18next from "@/i18n/i18n";
import { SmsLogData } from "@/api/sms-log/get";
import { ResPostList } from "@/api/types";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<SmsLogData>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   align: "center",
    //   render: (value: number) => value.toLocaleString(),
    // },
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("col.bankName"),
      dataIndex: "Bank",
      key: "Bank",
      align: "center",
    },
    {
      title: t("col.amount"),
      dataIndex: "Amount",
      key: "Amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} /> 
    },
    {
      title: t("col.depositorName"),
      dataIndex: "Depositor",
      key: "Depositor",
      align: "center",
    },
    {
      title: t("created at"),
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.status"),
      dataIndex: "Status",
      key: "Status",
      align: "center",
      render: (value: number) => {
        if (value === 0) {
          return i18next.t("payment.received");
        } else if (value === 1) {
          return i18next.t("payment.processed");
        } else if (value === 2) {
          return i18next.t("payment.duplicateWaiting");
        } else if (value === 3) {
          return i18next.t("payment.noMatch");
        } else if (value === 4) {
          return i18next.t("payment.processing");
        } else if (value === 5) {
          return i18next.t("sidemenu.sm063");
        } else {
          return '-';
        }
      }
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
      tableLayout="auto"
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      loading={loading}
      pagination={pagination}
    />
  );
};

export default List;
