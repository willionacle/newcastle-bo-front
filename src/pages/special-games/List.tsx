import i18next from "@/i18n/i18n";
import { SpecialGameData } from "@/api/special-games/get";
import { deleteSpecialGame } from "@/api/special-games/delete";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Space, Table, TableProps, Tag } from "antd";
import { PaginationProps } from "antd/lib";
import StatusActionTag from "./components/StatusActionTag";
import SettleModal from "./components/SettleModal";

interface Props {
  data: SpecialGameData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: () => void;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const columnsArray: TableProps<SpecialGameData>["columns"] = [
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 20)) -
        index,
    },
    {
      title: i18next.t("specialGames.title"),
      dataIndex: "title",
      key: "title",
      align: "start",
    },
    {
      title: i18next.t("col.category"),
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: i18next.t("specialGames.betStartAt"),
      dataIndex: "betStartAt",
      key: "betStartAt",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: i18next.t("specialGames.betEndAt"),
      dataIndex: "betEndAt",
      key: "betEndAt",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: i18next.t("specialGames.isVisible"),
      dataIndex: "isVisible",
      key: "isVisible",
      align: "center",
      render: (value) => (
        <Tag color={value ? "green" : "default"}>{value ? i18next.t("global.true") : i18next.t("global.false")}</Tag>
      ),
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => <StatusActionTag record={record} mutate={mutate} />,
    },
    {
      title: i18next.t("global.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: i18next.t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          {record.status === "closed" && <SettleModal record={record} mutate={mutate} />}
          <EditBtn link={`/special-games/edit/${record.id}`} />
          <DeleteBtn
            handleDelete={() => {
              (async function () {
                if (await deleteSpecialGame(record.id)) {
                  mutate();
                }
              })();
            }}
          />
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
      tableLayout="auto"
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default List;
