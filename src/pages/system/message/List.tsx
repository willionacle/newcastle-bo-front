import { deleteMessageAPI } from "@/api/messages/delete";
import { MessageData } from "@/api/messages/get";
import { SWRType } from "@/api/types";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditorViewer from "@/components/EditorViewer";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Modal, Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: MessageData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<MessageData[]>>;
}

const List = ({ data, loading, onHeaderCell, pagination, mutate }: Props) => {
  const [msg, setMsg] = useState("");
  const { t } = useTranslation();

  const columnsArray: TableProps<MessageData>["columns"] = [
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
      dataIndex: "message_title",
      align: "center",
      render: (value) => <div className="custom-wrap-text">{value}</div>,
    },
    {
      title: t("message.msg003"),
      dataIndex: "message_body",
      align: "center",
      render: (value) => (
        <div className="custom-wrap-text">{<EditorViewer data={value} />}</div>
      ),
    },
    {
      title: t("message.msg004"),
      dataIndex: "receiver_username",
      align: "center",
      render: (value) => (value ? value : "-"),
    },
    {
      title: t("col.received"),
      dataIndex: "read_date_time",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
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
      render: (_, record) =>
        record.read_date_time ? null : (
          <Space
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* <EditBtn link={`/system/message/edit/${record.id}`} /> */}
            <DeleteBtn
              handleDelete={() => {
                deleteMessageAPI(record.id);
                mutate();
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
    <>
      <Table
        sticky
        dataSource={data}
        loading={loading}
        rowKey={"id"}
        columns={columns}
        tableLayout="auto"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
        onRow={(record) => {
          return {
            onClick: () => {
              setMsg(record.message_body);
            },
            style: {
              cursor: "pointer",
            },
          };
        }}
      />
      <Modal
        open={!!msg}
        onCancel={() => setMsg("")}
        onOk={() => setMsg("")}
        width={720}
        destroyOnClose
        footer={null}
      >
        <div style={{ padding: "10px 5px" }}>
          <EditorViewer data={msg} />
        </div>
      </Modal>
    </>
  );
};

export default List;
