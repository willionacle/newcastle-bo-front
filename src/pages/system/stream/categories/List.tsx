import { api } from "@/api/axios";
import { CategoryData } from "@/api/stream-community/get";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
import { notification, Switch, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  data: CategoryData[] | undefined;
  loading: boolean;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
}

const List = ({ data, loading, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();

  const handleChangeVisible = async (e: boolean, record: CategoryData) => {
    const { token } = useUserStore.getState();
    try {
      const reqBody = {
        id: record.id,
        is_visible: e ? 1 : 0,
      };

      const res = await api.toggleScCategory(reqBody, token);

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
      width:"100px",
    },
    {
      title: t("col.sport"),
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: t("col.displayName"),
      dataIndex: "display_name",
      key: "display_name",
      align: "center",
      render: (value: string) => value ?? "-"
    },
    {
      title: t("col.showHide"),
      dataIndex: "is_visible",
      align: "center",
      width:"200px",
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangeVisible(e, record)}
        />
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
        pagination={false}
      />
    </div>
  );
};

export default List;
