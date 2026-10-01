import { api } from "@/api/axios";
import { ChatUser } from "@/api/stream-community/get";
import DetailBtn from "@/components/DetailBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";
import { Modal, notification, Space, Switch, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ChatDetail from "./detail/ChatDetail";
import DateText from "@/components/DateText";

interface Props {
  data: ChatUser[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();
  const [item, setItem] = useState<ChatUser | undefined>();

  const handleChangeToggle = async (e: boolean, record: ChatUser) => {
    const { token } = useUserStore.getState();
    try {
      const reqBody = {
        user_id: record.user_id,
        is_allowed: e ? 1 : 0,
      };

      const res = await api.toggleChatAllow(reqBody, token);

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

  const handleChangeToggleAllowDelete = async (e: boolean, record: ChatUser) => {
    const { token } = useUserStore.getState();
    try {
      const reqBody = {
        user_id: record.user_id,
        is_delete_allowed: e ? 1 : 0,
      };

      const res = await api.toggleChatAllowDelete(reqBody, token);

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

  const handleChangeToggleIsAdmin = async (e: boolean, record: ChatUser) => {
    const { token } = useUserStore.getState();
    try {
      const reqBody = {
        user_id: record.user_id,
        is_admin: e ? 1 : 0,
      };

      const res = await api.toggleIsAdmin(reqBody, token);

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
      title: t("ID"),
      dataIndex: "name",
      key: "name",
      align: "center",
      width:"100px",
      render: (value, record) => <Link to={`/user/${record.user_id}`} children={value} />
    },
    {
      title: t("memberInfo.mi006"),
      dataIndex: "real_name",
      key: "real_name",
      align: "center",
    },
    {
      title: t("memberInfo.mi007"),
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (value) => value ? value : '-',
    },
    {
      title: t("col.lastComment"),
      dataIndex: "last_chat",
      key: "last_chat",
      align: "center",
      render: (value) => value ? value : '-',
    },
    {
      title: t("memberInfo.mi035"),
      dataIndex: "grade",
      key: "grade",
      align: "center",
      render: (value) => GF.handleGradeStrVal(value),
    },
    {
      title: t("col.chatLevel"),
      dataIndex: "chat_level",
      key: "chat_level",
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
      title: t("col.deleteAllowBlock"),
      dataIndex: "is_delete_allowed",
      align: "center",
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangeToggleAllowDelete(e, record)}
        />
      ),
    },
    {
      title: t("col.isAdmin"),
      dataIndex: "is_admin",
      align: "center",
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangeToggleIsAdmin(e, record)}
        />
      ),
    },
    {
      title: t("col.dateTime"),
      dataIndex: "comment_date",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp/>,
    },
    {
      title: t("global.action"),
      key: "action",
      align: "right",
      width:"fit-content",
      render: (_, record) => (
        <Space>
          <DetailBtn onClick={() => setItem(record)} />
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
      <Modal
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        destroyOnClose
        open={!!item}
        onCancel={() => setItem(undefined)}
        centered
        width={"80%"}
        styles={{
          content: {
            paddingTop: "3rem",
          },
        }}
      >
        {item && (
          <ChatDetail  data={item} />
        )}
      </Modal>
    </div>
  );
};

export default List;
