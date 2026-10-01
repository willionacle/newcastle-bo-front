import { deleteMessageTemplateAPI } from "@/api/message-template/delete";
import { MessageTemplateData } from "@/api/message-template/get";
import { SWRType } from "@/api/types";
import CustomWrapText from "@/components/CustomWrapText";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: MessageTemplateData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<MessageTemplateData[]>>;
}

const List = ({ data, loading, onHeaderCell, pagination, mutate }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<MessageTemplateData>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   key: "id",
    //   render: (value) => value.toLocaleString(),
    //   align: "center",
    // },
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: t("message.msg002"),
      dataIndex: "title",
      align: "center",
      render: (value) => <div className="custom-wrap-text">{value}</div>,
    },
    {
      title: t("message.msg003"),
      dataIndex: "message",
      align: "center",
      render: (value) => (
        <CustomWrapText data={value} />
      ),
    },
    {
      title: t("message.msg005"),
      dataIndex: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("global.action"),
      fixed: "right",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <EditBtn link={`/system/message-template/edit/${record.id}`} />

          <DeleteBtn
            handleDelete={async () => {
              if (await deleteMessageTemplateAPI(record.id)) {
                mutate();
              }
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
      rowKey={"id"}
      columns={columns}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
