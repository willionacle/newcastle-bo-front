import i18next from "@/i18n/i18n";
import { deleteDepositBonuses } from "@/api/deposit-bonuses/delete";
import { DepositBonusesData } from "@/api/deposit-bonuses/get";
import { ResPostList, SWRType } from "@/api/types";
import { Strapi } from "@/api/types/strapi";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
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

const List = ({ data, loading, onHeaderCell, pagination, mutate }: Props) => {
  const { t } = useTranslation();

  const handleDelete = async (id: Strapi["id"]) => {
    if (await deleteDepositBonuses(id)) {
      mutate();
    }
  };

  const columnsArray: TableProps<DepositBonusesData>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    // },
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("depositBonus.db010"),
      dataIndex: "bonus_group",
      key: "bonus_group",
      align: "center",
    },
    {
      title: t("depositBonus.db002"),
      dataIndex: "bonus_name",
      key: "bonus_name",
      align: "center",
    },
    {
      title: t("depositBonus.db003"),
      dataIndex: "bonus_percentage",
      key: "bonus_percentage",
      align: "center",
    },
    {
      title: t("depositBonus.db004"),
      dataIndex: "min_deposit",
      key: "min_deposit",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("depositBonus.db005"),
      dataIndex: "max_amount",
      key: "max_amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("depositBonus.db006"),
      dataIndex: "withdrawal_rolling",
      key: "withdrawal_rolling",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("depositBonus.db008"),
      dataIndex: "available_level",
      key: "available_level",
      align: "center",
      render: (value: number) => (value === 9999 ? i18next.t("col.all") : value),
    },
    {
      title: t("col.remarks"),
      dataIndex: "system_note",
      key: "system_note",
      align: "center",
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("depositBonus.db009"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.inUse"),
      dataIndex: "in_use",
      key: "in_use",
      align: "center",
      render: (value) => <TrueFalseStatus value={value} />,
    },
    {
      title: t("col.displayOrder"),
      dataIndex: "temp_order",
      key: "temp_order",
      align: "center",
    },
    {
      title: t("col.dailyPayoutCount"),
      dataIndex: "daily_limit",
      key: "daily_limit",
      align: "center",
    },
    {
      title: t("global.action"),
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            gap: "0.2rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <EditBtn link={`/promotion/edit/${record.id}`} />
          <DeleteBtn handleDelete={() => handleDelete(record.id)} />
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
      dataSource={data?.data}
      columns={columns}
      loading={loading}
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
