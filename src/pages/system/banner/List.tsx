import i18next from "@/i18n/i18n";
import { BannerData } from "@/api/banners/get";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import useDeleteItem from "@/hooks/useDeleteItem";
import { GF } from "@/utils/GlobalFunctions";
import { Image, Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: BannerData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  mutate: () => void
}

const List = ({ data, loading, pagination, mutate }: Props) => {
  const { t } = useTranslation();
  const { deleteItem} = useDeleteItem('deleteBanner')

  const handleDelete = (id: number) => {
    deleteItem(id, mutate());
  };

  const columns: TableProps<BannerData>["columns"] = [
    {
      title: t("banner.bn005"),
      dataIndex: "order",
      render: (value) => value.toLocaleString(),
      align: "center",
    },
    {
      title: t("banner.bn001"),
      dataIndex: "thumbnail",
      align: "center",
      render: (value: string) => (
        <Image
          height={80}
          src={
            `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`
          }
          preview={{
            src: `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`,
          }}
        />
      ),
    },
    {
      title: t("x"),
      dataIndex: "x",
      render: (value) => value.toLocaleString(),
      align: "center",
    },
    {
      title: t("y"),
      dataIndex: "y",
      render: (value) => value.toLocaleString(),
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
      title: t("col.domain"),
      dataIndex: "domain",
      align: "center",
      render: (value :string) => value === 'shared' ? i18next.t("status.common") : value
    },
    {
      title: t("banner.bn004"),
      dataIndex: "url",
      align: "center",
    },

    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <EditBtn link={`/system/banner/edit/${record.id}`} />
          <DeleteBtn handleDelete={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

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
