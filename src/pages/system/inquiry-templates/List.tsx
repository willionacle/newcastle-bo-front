import { Space, Switch, Table, TableProps, notification } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import DateText from "@/components/DateText";
import Btn from "@/components/Btn";
import DeleteBtn from "@/components/DeleteBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
import { InquiryTemplate } from "@/api/inquiry-templates/get";
import { updateInquiryTemplateAPI } from "@/api/inquiry-templates/put";
import { deleteInquiryTemplateAPI } from "@/api/inquiry-templates/delete";

interface Props {
  data: InquiryTemplate[];
  loading: boolean;
  categoryLabel: (key: string) => string;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  onEdit: (item: InquiryTemplate) => void;
  mutate: () => void;
}

const List = ({ data, loading, categoryLabel, pagination, onHeaderCell, onEdit, mutate }: Props) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();

  const handleToggleActive = async (item: InquiryTemplate, checked: boolean) => {
    try {
      const res = await updateInquiryTemplateAPI(item.id, { isActive: checked }, token);
      const { code, message } = res.data;
      if (code === 0) {
        mutate();
      } else {
        notification.error({ message });
      }
    } catch (error) {
      notification.error({ message: t("toast.common.updateFailed") });
    }
  };

  // Deleting is safe — the resolved text is already copied into any past answer.
  // isActive:false (the Switch above) is the softer alternative that keeps history.
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteInquiryTemplateAPI(id, token);
      const { code, message } = res.data;
      if (code === 0) {
        notification.success({ message: t("toast.common.deleteSuccess") });
        mutate();
      } else {
        notification.error({ message });
      }
    } catch (error) {
      notification.error({ message: t("toast.common.deleteFailed") });
    }
  };

  const columnsArray: TableProps<InquiryTemplate>["columns"] = [
    {
      title: t("inquiryTemplate.category"),
      dataIndex: "category",
      align: "center",
      render: (value: string) => categoryLabel(value),
    },
    {
      title: t("inquiryTemplate.title"),
      dataIndex: "title",
      align: "start",
    },
    {
      title: t("inquiryTemplate.sortOrder"),
      dataIndex: "sortOrder",
      key: "sort_order",
      align: "center",
    },
    {
      title: t("inquiryTemplate.useCount"),
      dataIndex: "useCount",
      key: "use_count",
      align: "center",
    },
    {
      title: t("inquiryTemplate.isActive"),
      dataIndex: "isActive",
      align: "center",
      render: (value: boolean, record) => (
        <Switch checked={value} onChange={(checked) => handleToggleActive(record, checked)} />
      ),
    },
    {
      title: t("inquiryTemplate.updatedAt"),
      dataIndex: "updatedAt",
      key: "updated_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("global.action"),
      key: "action",
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Btn btnType="edit" onClick={() => onEdit(record)} />
          <DeleteBtn handleDelete={() => handleDelete(record.id)} />
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
      rowKey="id"
      columns={columns}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
