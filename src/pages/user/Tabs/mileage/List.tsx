import { MileageData } from "@/api/mileage/get";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: MileageData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<MileageData>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("memberDetail.mis028"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("memberDetail.mis041"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("col.total"),
      align: "center",
      render: (_, record) =>
        ((record.prevMileage ?? 0) + record.amount).toLocaleString(),
    },
    {
      title: t("memberDetail.mis040"),
      dataIndex: "type2",
      key: "type2",
      align: "center",
    },
    {
      title: t("memberDetail.mis042"),
      dataIndex: "systemNote",
      key: "systemNote",
      align: "center",
    },
    {
      title: t("global.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: t("memberDetail.mis029"),
      dataIndex: "adminId",
      key: "adminId",
      align: "center",
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

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
