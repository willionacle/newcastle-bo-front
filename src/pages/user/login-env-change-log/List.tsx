import { LoginEnvChangeLog } from "@/api/login-env-change-logs/get";
import i18next from "@/i18n/i18n";
import { restoreVAccounts, toggleWhitelist } from "@/api/login-env-change-logs/patch";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Button, notification, Popconfirm, Space, Table, TableProps, Tag } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { KeyedMutator } from "swr";

interface Props {
  data: LoginEnvChangeLog[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<any>;
}

const List = ({ data, loading, onHeaderCell, pagination, mutate }: Props) => {
  const { t } = useTranslation();

  const handleRestore = async (id: number) => {
    try {
      const res = await restoreVAccounts(id);
      if (res.code === 0) {
        notification.success({ message: res.message });
        mutate();
      } else {
        notification.error({ message: res.message });
      }
    } catch (e: any) {
      notification.error({
        message: e.response?.data?.message || i18next.t("user.restoreFailed"),
      });
    }
  };

  const handleWhitelist = async (username: string, isWhitelist: boolean) => {
    try {
      const res = await toggleWhitelist(username, isWhitelist);
      if (res.code === 0) {
        notification.success({ message: res.message });
        mutate();
      } else {
        notification.error({ message: res.message });
      }
    } catch (e: any) {
      notification.error({
        message: e.response?.data?.message || i18next.t("user.whitelistChangeFailed"),
      });
    }
  };

  const renderVAccounts = (record: LoginEnvChangeLog) => {
    const accounts = [
      record.vAccount1InUse,
      record.vAccount2InUse,
      record.vAccount3InUse,
      record.vAccount4InUse,
      record.vAccount5InUse,
      record.vAccount6InUse,
    ];
    return accounts
      .map((v, i) => (v !== null && v !== undefined ? `V${i + 1}:${v}` : null))
      .filter(Boolean)
      .join(", ") || "-";
  };

  const columnsArray: TableProps<LoginEnvChangeLog>["columns"] = [
    {
      title: "No",
      align: "center",
      width: 60,
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      // title: t("col.username"),
      title: t("memberInfo.mi004"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) =>
        record.userId ? (
          <Link to={`/user/${record.userId}`}>
            <ColorizeUsername username={value} />
          </Link>
        ) : (
          <ColorizeUsername username={value} />
        ),
    },
    {
      title: t("memberInfo.mi006"),
      dataIndex: "userRealName",
      key:  "userRealName",
      align: "center",
    },
    {
      title: t("memberInfo.mi035"),
      dataIndex: "userGrade",
      key: "userGradeDay",
      align: "center",
      render: (value, record) => {
        const isRecentDeposit = record?.lastDepositDate
          ? (Date.now() - new Date(record.lastDepositDate).getTime()) / (1000 * 60 * 60 * 24) <= 30
          : false;
        return GF.getGradeDisplay({
          userGrade: value ?? null,
          userGradeDay: record?.userGradeDay ?? null,
          localGradeConfig: record?.localGradeConfig,
          isRecentDeposit,
        });
      },
    },
    {
      title: t("memberInfo.mi007"),
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (value) => value ? value : '-',
    },
    {
      title: t("col.browser"),
      dataIndex: "browser",
      key: "browser",
      align: "center",
    },
    {
      title: "OS",
      dataIndex: "os",
      key: "os",
      align: "center",
    },
    {
      title: t("col.device"),
      dataIndex: "device",
      key: "device",
      align: "center",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      align: "center",
    },
    {
      title: t("col.previousBrowser"),
      dataIndex: "prevBrowser",
      key: "prevBrowser",
      align: "center",
    },
    {
      title: t("col.previousOs"),
      dataIndex: "prevOs",
      key: "prevOs",
      align: "center",
    },
    {
      title: t("col.previousDevice"),
      dataIndex: "prevDevice",
      key: "prevDevice",
      align: "center",
    },
    {
      title: "V-Account",
      align: "center",
      render: (_, record) => renderVAccounts(record),
    },
    {
      title: t("col.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: boolean) =>
        !value ? (
          <Tag color="red">{i18next.t("status.blocking")}</Tag>
        ) : (
          <Tag color="green">{i18next.t("status.restored")}</Tag>
        ),
    },
    {
      title: t("col.changeReason"),
      dataIndex: "changeReason",
      key: "change_reason",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("col.registeredDate"),
      dataIndex: "createdAt",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.feature"),
      key: "action",
      align: "center",
      fixed: "right",
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title={i18next.t("title.confirmRestoreVAccount")}
            onConfirm={() => handleRestore(record.id)}
            okText={i18next.t("global.confirm")}
            cancelText={i18next.t("global.cancel")}
          >
            <Button size="small" type="primary" disabled={!!record.status}>
              계좌복원
            </Button>
          </Popconfirm>
          <Popconfirm
            title={i18next.t("user.confirmAddWhitelist", { username: record.username })}
            onConfirm={() => handleWhitelist(record.username, true)}
            okText={i18next.t("global.confirm")}
            cancelText={i18next.t("global.cancel")}
          >
            <Button size="small" disabled={!!record.isWhitelist}>{i18next.t("status.white")}</Button>
          </Popconfirm>
          <Popconfirm
            title={i18next.t("user.confirmRemoveWhitelist", { username: record.username })}
            onConfirm={() => handleWhitelist(record.username, false)}
            okText={i18next.t("global.confirm")}
            cancelText={i18next.t("global.cancel")}
          >
            <Button size="small" danger disabled={!record.isWhitelist}>
              화이트취소
            </Button>
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
      rowKey="id"
      loading={loading}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
