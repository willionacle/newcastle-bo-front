import { BalanceLog } from "@/api/balance-logs/get";
import { ResPostList } from "@/api/types";
import CommaNumber from "@/components/CommaNumber";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: ResPostList['data'] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType | null;
  onDateSelect?: (date: string) => void;
}

const List = ({ data, loading, pagination, onHeaderCell, onDateSelect }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<BalanceLog>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
      // render: (value: number) => <CommaNumber value={value} />,
    },
    // {
    //   title: t("memberDetail.mis028"),
    //   dataIndex: "username",
    //   key: "username",
    //   align: "center",
    // },
    {
      title: t("col.balanceBefore"),
      dataIndex: "prev_balance",
      key: "prev_balance",
      align: "center",
      render: (value) => <CommaNumber value={value} />,
    },
    {
      title: t("memberDetail.mis041"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("col.balanceAfter"),
      dataIndex: "after_balance",
      key: "after_balance",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      // title: t("memberDetail.mis040"),
      title: t("col.category"),
      dataIndex: "record_type",
      key: "record_type",
      align: "center",
    },
    {
      title: t("memberDetail.mis042"),
      dataIndex: "system_note",
      key: "system_note",
      align: "center",
      render: (value, record) => {
        const handleClick = () => {
          if (onDateSelect && record.created_at) {
            // Convert UTC format to local format: "2025-09-09T16:49:12.816Z" -> "2025-09-09 16:49:12"
            const formattedDate = record.created_at
              .replace('T', ' ')
              .replace(/\.\d{3}Z$/, '');
            onDateSelect(formattedDate);
          }
        };
        
        if (record.transaction_id) {
          return <div 
            style={{ 
              color: record.amount < 0 ? "var(--ant-color-error-text)" : '',
              cursor: onDateSelect ? 'pointer' : 'default'
            }}
            onClick={handleClick}
          >
            <span style={{textTransform: 'uppercase'}}>{`${record.game_category}`} </span>
            <span style={{textTransform: 'uppercase'}}>{`${record.game_id}`} </span>
            <span>{`${value}`}</span>
            </div>
        } else {
          return <span 
            style={{ 
              color: record.amount < 0 ? "var(--ant-color-error-text)" : '',
              cursor: onDateSelect ? 'pointer' : 'default'
            }}
            onClick={handleClick}
          >{value}</span>
        }
      }
    },
    {
      title: t("col.processedDateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: BalanceLog["created_at"]) => (
        <span 
          style={{ cursor: onDateSelect ? 'pointer' : 'default' }}
          onClick={() => {
            if (onDateSelect && value) {
              // Convert UTC format to local format: "2025-09-09T16:49:12.816Z" -> "2025-09-09 16:49:12"
              const formattedDate = value
                .replace('T', ' ')
                .replace(/\.\d{3}Z$/, '');
              onDateSelect(formattedDate);
            }
          }}
        >
          {GF.cleanDateString(value, true)}
        </span>
        // <DateText date={value} timeStamp />
      ),
    },
    {
      title: t("col.processedBy"),
      dataIndex: "admin_id",
      key: "admin_id",
      align: "center",
    },
  ];

  const columns = onHeaderCell 
    ? columnsArray.map((item) =>
        item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
      )
    : columnsArray;

  return (
    <Table
      sticky 
      dataSource={data}
      columns={columns}
      loading={loading}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
