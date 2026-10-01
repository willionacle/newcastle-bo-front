import { useState } from "react";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DateText from "@/components/DateText";
import useUserStore from "@/store/user.store";
import useAdminAccessStore from "@/store/admin-access.store";
import { AdminAccount } from "@/api/admin-accounts/get";
import { setAdminStatusAPI, setAdminSuperAPI } from "@/api/admin-accounts/patch";
import { serverMessage } from "./serverMessage";

// Transfer / revoke super admin, hidden on request 2026-09-11. Nothing else
// changes: the buttons, their confirmations and the demotion handling below are
// all still here, and flipping this back to true restores them. The tier can
// still be moved from the API in the meantime.
const TIER_BUTTONS_ENABLED = false;

interface Props {
  data: AdminAccount[];
  loading: boolean;
  pagination: TableProps<AdminAccount>["pagination"];
  onHeaderCell: any;
  onSetPassword: (account: AdminAccount) => void;
  mutate: () => void;
}

const List = ({ data, loading, pagination, onHeaderCell, onSetPassword, mutate }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, userid } = useUserStore.getState();
  const setIsSuperAdmin = useAdminAccessStore((state) => state.setIsSuperAdmin);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Every guard below is enforced server-side and answers with code 1. Mirroring
  // them in the UI only avoids a pointless round trip and explains the refusal
  // before it happens — it is never what actually stops the action.
  const isSelf = (record: AdminAccount) => record.id === userid;

  // Rows come back super admin first, so page 1 carries every holder and this
  // count is the whole picture even though it only sees the current page.
  const superCount = data.filter((a) => a.isSuperAdmin).length;

  const run = async (
    id: number,
    call: () => Promise<{ data: { code: number; message: string; data?: any } }>,
    fallback: string,
    // Given, it owns what happens after a success — including whether the list
    // is refreshed at all. The tier transfer needs that: refreshing a list the
    // caller may no longer be allowed to read is the wrong move.
    onSuccess?: (data: any) => void
  ) => {
    setBusyId(id);
    try {
      const res = await call();
      if (res.data.code === 0) {
        notification.success({ message: res.data.message || t("toast.common.updateSuccess") });
        if (onSuccess) {
          onSuccess(res.data.data);
          return;
        }
        mutate();
      } else {
        // A refused guard, or the migration that has not been applied on this
        // client. Either way the server's message is the explanation.
        notification.error({ message: res.data.message || fallback });
      }
    } catch (error) {
      notification.error({ message: serverMessage(error, fallback) });
    } finally {
      setBusyId(null);
    }
  };

  const columns: TableProps<AdminAccount>["columns"] = [
    {
      title: t("adminAccounts.username"),
      dataIndex: "username",
      key: "username",
      align: "center",
      onHeaderCell,
    },
    {
      title: t("adminAccounts.name"),
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (value: string | null) => value || "-",
    },
    {
      title: t("adminAccounts.role"),
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (value: string, record) => (
        <>
          {value || "-"}
          {record.level !== null && record.level !== undefined && (
            <span style={{ marginLeft: 4, opacity: 0.65 }}>({record.level})</span>
          )}
        </>
      ),
    },
    {
      title: t("adminAccounts.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      // Login requires exactly ACTIVE; anything else cannot log in.
      render: (value: string) =>
        value === "ACTIVE" ? (
          <Tag color="green">{t("adminAccounts.statusActive")}</Tag>
        ) : (
          <Tag color="red">{t("adminAccounts.statusStoppedTag", { status: value || "-" })}</Tag>
        ),
    },
    {
      title: t("adminAccounts.tier"),
      dataIndex: "isSuperAdmin",
      key: "isSuperAdmin",
      align: "center",
      render: (value: boolean) =>
        value ? <Tag color="gold">{t("adminAccounts.super")}</Tag> : <Tag>{t("adminAccounts.ordinary")}</Tag>,
    },
    {
      title: "2FA",
      dataIndex: "twofaEnrolled",
      key: "twofaEnrolled",
      align: "center",
      render: (value: boolean) =>
        value ? t("adminAccounts.twofaOn") : t("adminAccounts.twofaOff"),
    },
    {
      title: t("adminAccounts.lastLogin"),
      dataIndex: "lastLogin",
      key: "lastLogin",
      align: "center",
      render: (value: string | null) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.feature"),
      key: "action",
      align: "center",
      render: (_, record) => {
        const self = isSelf(record);
        const active = record.status === "ACTIVE";

        return (
          <Space size={4} wrap>
            <Button size="small" loading={busyId === record.id} onClick={() => onSetPassword(record)}>
              {t("adminAccounts.setPassword")}
            </Button>

            {/* Disabling your own account takes effect immediately and would
                need SSH to undo, so the server refuses it outright. */}
            <Tooltip title={self ? t("adminAccounts.cannotSelfDisable") : undefined}>
              <Popconfirm
                title={active ? t("adminAccounts.confirmDisable") : t("adminAccounts.confirmEnable")}
                disabled={self && active}
                onConfirm={() =>
                  run(
                    record.id,
                    () => setAdminStatusAPI(record.id, !active, token),
                    t(active ? "adminAccounts.disableFailed" : "adminAccounts.enableFailed")
                  )
                }
                okText={t("global.confirm")}
                cancelText={t("global.cancel")}
              >
                {/* `danger` alone is not enough here: the theme paints default
                    buttons with colorPrimary and white text, so a plain danger
                    button comes out indigo-filled with a red ring. Destructive
                    actions in this app are `danger type="primary"`. */}
                <Button
                  size="small"
                  {...(active ? ({ danger: true, type: "primary" } as const) : {})}
                  disabled={self && active}
                  loading={busyId === record.id}
                >
                  {active ? t("adminAccounts.disable") : t("adminAccounts.enable")}
                </Button>
              </Popconfirm>
            </Tooltip>

            {/* Revoke only exists while more than one admin holds the tier —
                the state the older clients were left in. Once exactly one does,
                the server refuses every revoke ("There must always be exactly
                one super admin"), so the button is hidden rather than left to
                fail. Removing your own tier is refused regardless. */}
            {TIER_BUTTONS_ENABLED && (!record.isSuperAdmin || superCount > 1) && (
              <Tooltip title={self && record.isSuperAdmin ? t("adminAccounts.cannotSelfDemote") : undefined}>
                <Popconfirm
                  title={
                    record.isSuperAdmin
                      ? t("adminAccounts.confirmRevokeSuper")
                      : t("adminAccounts.confirmGrantSuper")
                  }
                  disabled={self && record.isSuperAdmin}
                  onConfirm={() =>
                    run(
                      record.id,
                      () => setAdminSuperAPI(record.id, !record.isSuperAdmin, token),
                      t("adminAccounts.tierChangeFailed"),
                      // A transfer demotes everyone else, the caller included.
                      // `callerDemoted` says this session lost the tier: the
                      // buttons on this screen would all 403 from here and the
                      // sidebar entry has to go with them, so drop the stored
                      // tier and leave rather than refresh a list that is no
                      // longer readable.
                      (result) => {
                        if (result?.callerDemoted) {
                          setIsSuperAdmin(false);
                          navigate("/", { replace: true });
                          return;
                        }
                        mutate();
                      }
                    )
                  }
                  okText={t("global.confirm")}
                  cancelText={t("global.cancel")}
                >
                  <Button
                    size="small"
                    disabled={self && record.isSuperAdmin}
                    loading={busyId === record.id}
                  >
                    {record.isSuperAdmin
                      ? t("adminAccounts.revokeSuper")
                      : t("adminAccounts.grantSuper")}
                  </Button>
                </Popconfirm>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default List;
