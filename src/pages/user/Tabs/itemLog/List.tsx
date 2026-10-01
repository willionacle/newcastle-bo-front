import { deleteCoupons } from "@/api/coupon/delete";
import { ItemSaleData } from "@/api/item-sale/get";
import { StrapiRes } from "@/api/types/strapi";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: ItemSaleData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<StrapiRes<ItemSaleData[]>>;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<ItemSaleData>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("coupon.cp004"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("coupon.cp008"),
      dataIndex: "gameitem",
      key: "gameitem.itemName",
      align: "center",
      render: (value: ItemSaleData["gameitem"]) =>
        value ? value.itemName : "-",
    },
    {
      title: t("coupon.cp003"),
      dataIndex: "isUsed",
      key: "isUsed",
      align: "center",
      render: (value: boolean) => <TrueFalseStatus value={value} />,
    },
    {
      title: t("coupon.cp009"),
      dataIndex: "systemNote",
      key: "systemNote",
      align: "center",
    },
    {
      title: t("col.adminId"),
      dataIndex: "adminId",
      key: "adminId",
      align: "center",
      render: (value) => (value ? value : "-"),
    },
    {
      title: t("col.purchaseDateTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.usedDateTime"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (value: string, record) =>
        record.isUsed ? <DateText date={value} timeStamp /> : "",
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        if (!record.isUsed) {
          return (
            <DeleteBtn
              handleDelete={async () => {
                if (await deleteCoupons(record.id)) {
                  mutate();
                }
              }}
            />
          );
        }
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
