import { deleteCouponName } from "@/api/coupon-name/delete";
import { CouponNameData } from "@/api/coupon-name/get";
import { CouponData } from "@/api/coupon/get";
import { ResPostList, SWRType } from "@/api/types";
// import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { notification, Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<CouponNameData[]>>;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();

  const handleDelete = async (id: CouponData['id']) => {
    try {
      const res = await deleteCouponName(id)

      const {data: {code, message}} = res

      if (code === 0) {
        console.log('mutate!')
        mutate();
      } else {
        notification.error({
          message: message,
          type: "error",
        });
      }

    } catch (error) {
      console.error(error)
    }
  }

  const columnsArray: TableProps<CouponData>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   render: (value: number) => <CommaNumber value={value} />,
    // },
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("coupon.cp008"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t("coupon.cp012"),
      dataIndex: "coupon_content",
      key: "coupon_content",
      align: "center",
    },
    {
      title: t("col.createdDateTime"),
      dataIndex: "created_at",
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
        <Space>
          <EditBtn link={`edit/${record.id}`} />
          <DeleteBtn handleDelete={() => handleDelete(record.id)} />
        </Space>
      ),
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
