import { NoticeData } from "@/api/notice/get";
// import { deleteRegulationAPI } from "@/api/regulation/delete";
import DateText from "@/components/DateText";
// import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: NoticeData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
}

const List = ({ data, loading, pagination, onHeaderCell }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<NoticeData>["columns"] = [
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },

    {
      title: t("regulation.rg001"),
      dataIndex: "title",
      key: "title",
      align: "start",
    },
    // {
    //   title: t("regulation.rg002"),
    //   dataIndex: "content",
    //   key: "content",
    //   align: "start",
    // },
    {
      title: t("regulation.rg003"),
      dataIndex: "status",
      key: "status",
      align: "start",
      render: (value) => {
        if (value === 1) return t("regulation.rg005");
        if (value === 0) return t("regulation.rg006");
      },
    },
    {
      title: t("regulation.rg004"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.type"),
      dataIndex: "content_type",
      key: "content_type",
      align: "start",
      render: (value) => {
        if (value === "sport") return t("col.sportsRegulation");
        if (value === "betting") return t("col.bettingRegulation");
      },
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <EditBtn link={"/system/regulation/edit/" + record.id} />
          {/* <DeleteBtn
            handleDelete={() => {
              (async function () {
                if (await deleteRegulationAPI(record.id)) {
                  mutate();
                }
              })();
            }}
          /> */}
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
