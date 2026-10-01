import { deleteLevelConfig } from "@/api/level-configs/delete";
import { LevelConfigData } from "@/api/level-configs/get";
import { SWRType } from "@/api/types";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: LevelConfigData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<LevelConfigData[]>>;
}

const List = ({ data, loading, onHeaderCell, pagination, mutate }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<LevelConfigData>["columns"] = [
    {
      title: t("levelSetting.lvs002"),
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("levelSetting.lvs005"),
      dataIndex: "rolling_casino_percentage",
      key: "rolling_casino_percentage",
      align: "center",
      render: (value: number) => `${(value * 100).toPrecision(2)} %`,
    },
    {
      title: t("levelSetting.lvs005-1"),
      dataIndex: "rolling_slot_percentage",
      key: "rolling_slot_percentage",
      align: "center",
      render: (value: number) => `${(value * 100).toPrecision(2)} %`,
    },
    {
      title: t("levelSetting.lvs005-2"),
      dataIndex: "rolling_sports_percentage",
      key: "rolling_sports_percentage",
      align: "center",
      render: (value: number) => `${(value * 100).toPrecision(2)} %`,
    },
    {
      title: t("levelSetting.lvs005-3"),
      dataIndex: "rolling_mini_game_percentage",
      key: "rolling_mini_game_percentage",
      align: "center",
      render: (value: number) => `${(value * 100).toPrecision(2)} %`,
    },

    {
      title: t("levelSetting.lvs003"),
      dataIndex: "deposit_required",
      key: "deposit_required",
      align: "center",
      render: (value: string) => Number(value).toLocaleString(),
    },
    {
      title: t("levelSetting.lvs004"),
      dataIndex: "rolling_required",
      key: "rolling_required",
      align: "center",
      render: (value: string) => Number(value).toLocaleString(),
    },
    {
      title: t("levelSetting.lvs007"),
      dataIndex: "weekly_lossing_percentage",
      key: "weekly_lossing_percentage",
      align: "center",
      render: (value: number) => `${(value * 100).toPrecision(2)} %`,
    },
    {
      title: t("levelSetting.lvs008"),
      dataIndex: "maximum_lossing_amount",
      key: "maximum_lossing_amount",
      align: "center",
      render: (value: string) => Number(value).toLocaleString(),
    },
    {
      title: t("levelSetting.lvs012"),
      dataIndex: "level_up_mileage",
      key: "level_up_mileage",
      align: "center",
      render: (value: string) => Number(value).toLocaleString(),
    },
    {
      title: t("levelSetting.lvs011"),
      dataIndex: "mileage_percentage",
      key: "mileage_percentage",
      align: "center",
      render: (value: number) => `${(value * 100).toPrecision(2)} %`,
    },
    {
      title: t("global.action"),
      align: "center",
      render: (_, record) => (
        <>
          <EditBtn link={`/system/level/${record.id}`} />
          <DeleteBtn
            handleDelete={() => { deleteLevelConfig(record.id); mutate()}}
          />
        </>
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      rowKey={"id"}
      loading={loading}
      dataSource={data}
      columns={columns}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
