import { EventData } from "@/api/event/get";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import useDeleteItem from "@/hooks/useDeleteItem";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Image, Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: EventData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();
  const { deleteItem} = useDeleteItem('deleteEvent')

  const handleDelete = (id: number) => {
    deleteItem(id, mutate());
  };

  const columnsArray: TableProps<EventData>["columns"] = [
    {
      title: t("banner.bn005"),
      dataIndex: "order",
      key: "order",
      render: (value) => value.toLocaleString(),
      align: "center",
    },
    {
      title: t("banner.bn001"),
      dataIndex: "image",
      align: "center",
      render: (value) => (
        <Image
          height={80}
          src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`}
          preview={{
            src: `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`,
          }}
        />
      ),
    },
    {
      title: t("col.thumbnail"),
      dataIndex: "thumbnail",
      align: "center",
      render: (value) =>
        value ? (
          <Image
            height={80}
            src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`}
            preview={{
              src: `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`,
            }}
          />
        ) : undefined,
    },
    {
      title: t("bannerDetail.bnr006"),
      dataIndex: "title",
      render: (value: string) => (value ? value : "-"),
      align: "center",
    },
    {
      title: t("banner.bn002"),
      dataIndex: "start_date",
      render: (value: string) => <DateText date={value} />,
      align: "center",
    },
    {
      title: t("banner.bn003"),
      dataIndex: "end_date",
      render: (value: string) => <DateText date={value} />,
      align: "center",
    },
    {
      title: t("col.exposure"),
      dataIndex: "in_use",
      align: "center",
      render: (value: boolean) =>
        value ? t("global.true") : t("global.false"),
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <EditBtn link={`/system/event/edit/${record.id}`} />
          <DeleteBtn handleDelete={() => handleDelete(Number(record.id))} />
        </Space>
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <div>
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
    </div>
  );
};

export default List;
