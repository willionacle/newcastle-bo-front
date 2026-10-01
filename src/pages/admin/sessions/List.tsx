import { useState } from "react";
import { Button, Popconfirm, Table, TableProps, notification } from "antd";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";
import DateText from "@/components/DateText";
import { AdminSession, endSessionAPI } from "@/api/auth/sessions";
import useUserStore from "@/store/user.store";

interface Props {
  data: AdminSession[];
  loading: boolean;
  mutate: KeyedMutator<any>;
}

const List = ({ data, loading, mutate }: Props) => {
  const { t } = useTranslation();
  const token = useUserStore((state) => state.token);
  const [endingId, setEndingId] = useState<number | null>(null);

  const handleEnd = async (id: number) => {
    setEndingId(id);
    try {
      const res = await endSessionAPI(id, token);
      if (res.code === 0) {
        notification.success({ message: res.message || t("sessions.endSuccess") });
        mutate();
      } else {
        notification.error({ message: res.message || t("sessions.endFailed") });
      }
    } catch (e: any) {
      notification.error({
        message: e.response?.data?.message || t("sessions.endFailed"),
      });
    } finally {
      setEndingId(null);
    }
  };

  const fallback = (value: string) => value || t("sessions.unknownDevice");

  const columns: TableProps<AdminSession>["columns"] = [
    {
      title: t("sessions.operator"),
      dataIndex: "operator",
      key: "operator",
      align: "center",
      render: (value: string | null) => value || "-",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      align: "center",
    },
    {
      title: t("sessions.browser"),
      dataIndex: "browser",
      key: "browser",
      align: "center",
      render: fallback,
    },
    {
      title: t("sessions.device"),
      dataIndex: "device",
      key: "device",
      align: "center",
      render: fallback,
    },
    {
      title: t("sessions.system"),
      dataIndex: "system",
      key: "system",
      align: "center",
      render: fallback,
    },
    {
      title: t("sessions.issuedAt"),
      dataIndex: "issuedAt",
      key: "issuedAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("sessions.lastActiveAt"),
      dataIndex: "lastActiveAt",
      key: "lastActiveAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("sessions.expiresAt"),
      dataIndex: "expiresAt",
      key: "expiresAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.feature"),
      key: "action",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title={t("sessions.confirmEnd")}
          onConfirm={() => handleEnd(record.id)}
          okText={t("global.confirm")}
          cancelText={t("global.cancel")}
        >
          <Button size="small" danger loading={endingId === record.id}>
            {t("sessions.end")}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={false}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default List;
