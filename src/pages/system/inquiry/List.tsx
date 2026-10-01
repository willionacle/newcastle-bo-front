import { Button, Table, TableProps, Typography } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { InquiryItem } from "@/api/inquiry/get";
import { InquiryCategoryOption } from "@/api/inquiry/categories";
import InquiryStateTag from "./InquiryStateTag";

interface Props {
  data: InquiryItem[];
  categories: InquiryCategoryOption[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  onSelect: (item: InquiryItem) => void;
}

const List = ({ data, categories, loading, pagination, onHeaderCell, onSelect }: Props) => {
  const { t } = useTranslation();

  const categoryLabel = (key: string) =>
    categories.find((c) => c.key === key)?.labelKo ?? key;

  const columnsArray: TableProps<InquiryItem>["columns"] = [
    {
      title: t("inquiry.username"),
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: t("inquiry.category"),
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (value: string) => categoryLabel(value),
    },
    {
      title: t("inquiry.subject"),
      dataIndex: "title",
      key: "title",
      align: "start",
      render: (value: string, record) => (
        <Typography.Link onClick={() => onSelect(record)}>{value}</Typography.Link>
      ),
    },
    {
      title: t("inquiry.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: InquiryItem["status"]) => <InquiryStateTag value={value} />,
    },
    {
      title: t("inquiry.createdAt"),
      dataIndex: "createdAt",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Button size="small" onClick={() => onSelect(record)}>
          {t("inquiry.reply")}
        </Button>
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      dataSource={data}
      loading={loading}
      pagination={pagination}
      columns={columns}
      tableLayout="auto"
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default List;
