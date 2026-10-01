import { LevelAccountData } from "@/api/level-account.tsx/get";
import { ResPostList, SWRType } from "@/api/types";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import useDeleteItem from "@/hooks/useDeleteItem";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<ResPostList[]>>;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();
  const {deleteItem} = useDeleteItem('deleteLevelDep')

  const handleDelete = (id: number) => {
    deleteItem(id, mutate());
  };

  const columnsArray: TableProps<LevelAccountData>["columns"] = [
    {
      title: t("col.grade"),
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (value: number) => GF.handleGradeStrVal(value),
    },
    {
      title: t("col.bank"),
      dataIndex: "bank_name",
      key: "bank_name",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("col.accountNumber"),
      dataIndex: "account_number",
      key: "account_number",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("col.accountHolder"),
      dataIndex: "account_name",
      key: "account_name",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>

          <EditBtn link={"/system/grade-account/" + record.id} />
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
      dataSource={data}
      loading={loading}
      pagination={pagination}
      columns={columns}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default List;
