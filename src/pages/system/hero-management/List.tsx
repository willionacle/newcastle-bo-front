import { HeroManagementData } from "@/api/hero-management/get";
import { SWRType } from "@/api/types";
import { Strapi } from "@/api/types/strapi";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import useDeleteItem from "@/hooks/useDeleteItem";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Flex, Image, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: HeroManagementData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<HeroManagementData[]>>;
}

const List = ({ data, loading, pagination, mutate }: Props) => {
  const { t } = useTranslation();
  const {deleteItem} = useDeleteItem('deleteHero')

  const handleDelete = async (id: Strapi["id"]) => {
    deleteItem(id, mutate());
  };

  const columnsArray: TableProps<HeroManagementData>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   key: "id",
    //   render: (value) => value.toLocaleString(),
    //   align: "center",
    // },
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("col.desktopImage"),
      dataIndex: "imageDesktop",
      render: (value) => (
        <Image src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`}  />
      ),
      align: "center",
      width: "15%",
    },
    {
      title: t("col.mobileImage"),
      dataIndex: "imageMobile",
      render: (value) => (
        <Image src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`} />
      ),
      align: "center",
      width: "15%",
    },
    {
      title: t("col.category"),
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: t("col.exposureRank"),
      dataIndex: "order",
      key: "order",
      render: (value) => value.toLocaleString(),
      align: "center",
    },
    {
      title: t("col.inUse"),
      dataIndex: "in_use",
      key: "in_use",
      render: (value) => <TrueFalseStatus value={value} />,
      align: "center",
    },
    {
      title: t("global.action"),
      key: "action",
      render: (_, record) => (
        <Flex gap={4} align="center" justify="center">
          <EditBtn link={`/system/hero-management/edit/${record.id}`} />
          <DeleteBtn
            handleDelete={() => {
              handleDelete(record.id);
            }}
          />
        </Flex>
      ),
      align: "center",
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item } : item
  );
  return (
    <Table
      sticky
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      tableLayout="auto"
      pagination={pagination}
    />
  );
};

export default List;
