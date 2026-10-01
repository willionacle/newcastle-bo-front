import i18next from "@/i18n/i18n";
import { deleteFakeWithdrawal } from "@/api/fake-withdrawal/delete";
import { FakeWithdrawalData } from "@/api/fake-withdrawal/get";
import { StrapiRes } from "@/api/types/strapi";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps, notification } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: FakeWithdrawalData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<StrapiRes<FakeWithdrawalData[]>>;
}

const List = ({ data, loading, onHeaderCell, pagination, mutate }: Props) => {
  const { t } = useTranslation();

  const handleDelete = async (id: string) => {
    try {
      if (await deleteFakeWithdrawal(id)) {
        mutate();
      }
    } catch (error) {
      notification.error({
        message: i18next.t("toast.common.deleteFailed"),
      });
    }
  };

  const columnsArray: TableProps<FakeWithdrawalData>["columns"] = [
    {
      title: t("#"),
      key: "id",
      dataIndex: "id",
      align: "center",
    },
    {
      title: t("ID"),
      key: "username",
      dataIndex: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("col.amount"),
      key: "amount",
      dataIndex: "amount",
      align: "center",
      render: (value: string) => Number(value).toLocaleString(),
    },
    {
      title: t("col.createdDate"),
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.2rem",
          }}
        >
          <EditBtn link={`/payment/fake/edit/${record.id}`} />
          <DeleteBtn handleDelete={() => handleDelete(record.id.toString())} />
        </div>
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
      columns={columns}
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
