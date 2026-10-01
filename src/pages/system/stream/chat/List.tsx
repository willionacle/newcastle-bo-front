import { api } from "@/api/axios";
import { BannedWordData } from "@/api/stream-community/get";
import DeleteBtn from "@/components/DeleteBtn";
// import EditBtn from "@/components/EditBtn";
import useDeleteItem from "@/hooks/useDeleteItem";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
// import { GF } from "@/utils/GlobalFunctions";
import { notification, Space, Switch, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: BannedWordData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();
  const { deleteItem } = useDeleteItem("deleteScForbidWord");

  const handleDelete = (id: number) => {
    deleteItem(id, mutate());
  };

  const handleChangeToggle = async (e: boolean, record: BannedWordData) => {
    const { token } = useUserStore.getState();
    try {
      const reqBody = {
        id: record.id,
        is_allowed: e ? 1 : 0,
      };

      const res = await api.toggleChatForbidWord(reqBody, token);

      const {
        data: { code },
      } = res;
      if (code === 0) {
        notification.success({
          message: t("global.success"),
          duration: 1,
          type: "success",
        });
        mutate();
      } else {
        notification.error({
          message: t("global.error"),
          duration: 1,
          type: "success",
        });
      }
    } catch (error) {
      notification.error({
        message: t("global.fail"),
      });
    }
  };

  const columnsArray: TableProps["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      width:"100px"
    },
    {
      title: t("col.bannedWord"),
      dataIndex: "forbidden_word",
      key: "forbidden_word",
      align: "center",
    },
    {
      title: t("col.allowBlock"),
      dataIndex: "is_allowed",
      align: "center",
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangeToggle(e, record)}
        />
      ),
    },
    {
      title: t("global.action"),
      key: "action",
      align: "right",
      width:"200px",
      render: (_, record) => (
        <Space>
          {/* <EditBtn link={`/stream/chats/edit/${record.MatchID}`} /> */}
          <DeleteBtn
            handleDelete={() => handleDelete(Number(record.id))}
          />
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
        pagination={pagination}
      />
    </div>
  );
};

export default List;
