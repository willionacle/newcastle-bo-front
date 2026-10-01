import { api } from "@/api/axios";
import { BlockIpsData } from "@/api/block-ips/get";
import { BlockReasonCode, PostDeleteBlockIP } from "@/api/types";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
import dayjs from "dayjs";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tag,
  message,
  notification,
} from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: BlockIpsData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
  onOpenDetail: (ip: string) => void;
}

const REASON_META: Record<BlockReasonCode, { color: string; labelKey: string }> = {
  MANUAL: { color: "default", labelKey: "blockips.reasonManual" },
  AUTO_LOGIN_FAILURES: { color: "volcano", labelKey: "blockips.reasonAutoLoginFailures" },
  ABUSE: { color: "red", labelKey: "blockips.reasonAbuse" },
  HACKING_ATTEMPT: { color: "magenta", labelKey: "blockips.reasonHackingAttempt" },
  OTHER: { color: "default", labelKey: "blockips.reasonOther" },
};

const List = ({ data, loading, onHeaderCell, pagination, mutate, onOpenDetail }: Props) => {
  const { t } = useTranslation();
  const {token, userid} = useUserStore.getState()
  const cancel = () => {
    message.info(t("toast.common.releaseInfo"));
  };

  const confirm = async (id: PostDeleteBlockIP['id']) => {
    try {
      const res = await api.deleteBlockIP({userid: userid, id: id}, token)
      const { data: { code } } = res
      if (code == 0) {
          notification.success({
            message: t("toast.common.releaseSuccess"),
          });
          mutate();
      }

    } catch (e: any) {
      notification.error({
        message: t("toast.common.releaseFailed"),
      });
    }
  };

  const columnsArray: TableProps<BlockIpsData>["columns"] = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: t("blockips.bi001"),
      dataIndex: "ip",
      key: "ip",
      align: "center",
    },
    {
      title: t("blockips.bi002"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("global.systemNote"),
      dataIndex: "system_note",
      key: "system_note",
      align: "center",
    },
    {
      title: t("blockips.reasonCode"),
      dataIndex: "reason_code",
      key: "reason_code",
      align: "center",
      render: (value: BlockReasonCode | undefined) =>
        value ? (
          <Tag color={REASON_META[value]?.color ?? "default"}>
            {t(REASON_META[value]?.labelKey ?? "blockips.reasonOther")}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: t("blockips.username"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value: string | null | undefined) => value ?? "-",
    },
    {
      title: t("blockips.blockedBy"),
      dataIndex: "blocked_by",
      key: "blocked_by",
      align: "center",
      render: (value: string | null | undefined) => value ?? "-",
    },
    {
      title: t("blockips.expiresAt"),
      dataIndex: "expires_at",
      key: "expires_at",
      align: "center",
      render: (value: string | null | undefined) => {
        if (!value) return t("blockips.permanent");
        // The list intentionally still shows expired rows (only the login
        // check filters on expiry) — flag them so admins don't read the
        // row as still in force. See IP_BLOCK_FRONTEND_INTEGRATION.md §4.
        if (dayjs(value).isBefore(dayjs())) {
          return (
            <Space direction="vertical" size={0}>
              <DateText date={value} timeStamp />
              <Tag color="default">{t("blockips.expired")}</Tag>
            </Space>
          );
        }
        return <DateText date={value} timeStamp />;
      },
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => onOpenDetail(record.ip)}>
            {t("blockips.detail")}
          </Button>
          <Popconfirm
            title={t("blockips.bi003")}
            onCancel={cancel}
            onConfirm={() => confirm(record.id)}
          >
            <Button size="small">{t("blockips.bi003")}</Button>
          </Popconfirm>
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
      columns={columns}
      dataSource={data}
      rowKey={"id"}
      tableLayout="auto"
      loading={loading}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
