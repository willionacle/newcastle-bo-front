import { useMemo } from "react";
import { Space, Switch, Table, TableProps, Tag, notification } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import DateText from "@/components/DateText";
import Btn from "@/components/Btn";
import DeleteBtn from "@/components/DeleteBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
import { TargetType, TransactionRule, TransactionRuleMetaData } from "@/api/transaction-rules/types";
import { upsertTransactionRuleAPI } from "@/api/transaction-rules/post";
import { deleteTransactionRuleAPI } from "@/api/transaction-rules/delete";

interface Props {
  data: TransactionRule[];
  loading: boolean;
  meta?: TransactionRuleMetaData;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  onEdit: (item: TransactionRule) => void;
  mutate: () => void;
}

const TARGET_RANK: Record<TargetType, number> = { global: 0, partner: 1, user: 2 };

const List = ({ data, loading, meta, pagination, onHeaderCell, onEdit, mutate }: Props) => {
  const { t } = useTranslation();
  const { token } = useUserStore.getState();

  const allFields = useMemo(
    () => [
      ...(meta?.fieldGroups.deposit ?? []),
      ...(meta?.fieldGroups.withdraw ?? []),
      ...(meta?.fieldGroups.bonus ?? []),
    ],
    [meta]
  );

  // API doesn't guarantee row order — group global → partner → user, then name.
  const sorted = useMemo(
    () =>
      [...data].sort((a, b) => {
        const rank = TARGET_RANK[a.targetType] - TARGET_RANK[b.targetType];
        return rank !== 0 ? rank : a.name.localeCompare(b.name);
      }),
    [data]
  );

  const targetLabel = (targetType: TargetType) =>
    meta?.targets.find((tg) => tg.key === targetType)?.labelKo ?? targetType;

  // No partial-patch verb — flip isActive on the full record and re-upsert.
  const handleToggleActive = async (item: TransactionRule, checked: boolean) => {
    try {
      const { id: _id, adminId: _adminId, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = item;
      const res = await upsertTransactionRuleAPI({ ...rest, isActive: checked }, token);
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

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteTransactionRuleAPI(id, token);
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

  const columnsArray: TableProps<TransactionRule>["columns"] = [
    {
      title: t("transactionRules.name"),
      dataIndex: "name",
      align: "start",
    },
    {
      title: t("transactionRules.targetSection"),
      key: "target",
      align: "center",
      render: (_, record) => (
        <Tag color={record.targetType === "global" ? "default" : record.targetType === "partner" ? "blue" : "purple"}>
          {targetLabel(record.targetType)}
          {record.targetValue ? ` · ${record.targetValue}` : ""}
        </Tag>
      ),
    },
    {
      title: t("transactionRules.summary"),
      key: "summary",
      align: "center",
      render: (_, record) => {
        const count = allFields.filter((f) => (record as any)[f] !== null).length;
        return count > 0 ? t("transactionRules.summaryCount", { count }) : "-";
      },
    },
    {
      title: t("transactionRules.isActive"),
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
          {record.targetType !== "global" && <DeleteBtn handleDelete={() => handleDelete(record.id)} />}
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
      dataSource={sorted}
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
