import { LoginRecords2, UserByIp, getUsersByIp } from "@/api/login-records/get";
import DateText from "@/components/DateText";
import MemberStatus from "@/components/MemberStatus";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Modal, Table, TableProps, Tooltip } from "antd";
import { PaginationProps } from "antd/lib";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  data: LoginRecords2[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

/**
 * Region text. Prefer the backend's readable `ip_location`; otherwise fall back
 * to the stored geo JSON (`{"country":"KR","city":...}`). Never throws on a
 * malformed value — the shared IPLocation component does a raw JSON.parse.
 */
const regionText = (record: LoginRecords2) => {
  if (record.ip_location) return record.ip_location;
  if (!record.geo_location) return "-";
  try {
    const geo = JSON.parse(record.geo_location);
    if (geo && typeof geo === "object") {
      const parts = [geo.city, geo.region, geo.country].filter(Boolean);
      return parts.length ? parts.join(", ") : "-";
    }
    return String(geo);
  } catch {
    return record.geo_location;
  }
};

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();
  const [ipModalOpen, setIpModalOpen] = useState(false);
  const [selectedIp, setSelectedIp] = useState<string>("");
  const [ipUsers, setIpUsers] = useState<UserByIp[]>([]);
  const [ipUsersLoading, setIpUsersLoading] = useState(false);
  // Ignore a slow answer for an IP the operator has already moved away from
  const requestedIpRef = useRef<string>("");

  const handleIpClick = async (ip: string) => {
    requestedIpRef.current = ip;
    setSelectedIp(ip);
    setIpUsers([]);
    setIpModalOpen(true);
    setIpUsersLoading(true);
    try {
      const users = await getUsersByIp(ip);
      if (requestedIpRef.current === ip) setIpUsers(users);
    } catch {
      // The global interceptor already reports HTTP errors
    } finally {
      if (requestedIpRef.current === ip) setIpUsersLoading(false);
    }
  };

  const columnsArray: TableProps<LoginRecords2>["columns"] = [
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: t("ID"),
      dataIndex: "user",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.user_id}`}>{value}</Link>
      ),
    },
    {
      title: t("memberInfo.mi006"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
    },
    {
      title: t("adminLog.adl007"),
      dataIndex: "ip",
      align: "center",
      render: (value: string, record) => {
        // has_duplicate_ip is all-time: the IP has been used by another member account, ever
        const isDuplicate = Number(record.has_duplicate_ip) === 1;
        return isDuplicate ? (
          <Tooltip title={t("loginLog.duplicateIpHint")}>
            <span
              role="button"
              tabIndex={0}
              style={{
                color: "var(--ant-color-error-text)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => handleIpClick(value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleIpClick(value);
              }}
            >
              {value}
            </span>
          </Tooltip>
        ) : (
          <span>{value}</span>
        );
      },
    },
    {
      title: t("adminLog.adl008"),
      dataIndex: "login_date_time",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.region"),
      dataIndex: "ip_location",
      align: "center",
      render: (_value, record) => regionText(record),
    },
    {
      title: t("adminLog.adl010"),
      dataIndex: "status",
      align: "center",
      render: (value: boolean) =>
        value ? t("global.true") : t("global.false"),
    },
    {
      title: t("App"),
      dataIndex: "is_app_login",
      align: "center",
      render: (value: boolean) => (value ? "O" : "X"),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item,
  );

  const ipUserColumns: TableProps<UserByIp>["columns"] = [
    {
      title: t("ID"),
      dataIndex: "user",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.user_id}`} onClick={() => setIpModalOpen(false)}>
          {value}
        </Link>
      ),
    },
    {
      title: t("memberInfo.mi006"),
      dataIndex: "user_real_name",
      align: "center",
      render: (value: string | null) => value || "-",
    },
    {
      // Text status on this backend (ACTIVE, SUSPENDED, ...)
      title: t("adminLog.adl010"),
      dataIndex: "user_status",
      align: "center",
      render: (value: string | null) => <MemberStatus value={value} />,
    },
    {
      title: t("loginLog.loginCount"),
      dataIndex: "login_count",
      align: "center",
      render: (value: number | undefined) =>
        value === undefined || value === null ? "-" : Number(value).toLocaleString(),
    },
    {
      title: t("loginLog.lastLoginAt"),
      dataIndex: "last_login_at",
      align: "center",
      render: (value: string | null) =>
        value ? <DateText date={value} timeStamp /> : "-",
    },
  ];

  return (
    <>
      <Table
        sticky
        dataSource={data}
        rowKey={"id"}
        loading={loading}
        columns={columns}
        tableLayout="auto"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
      />
      <Modal
        open={ipModalOpen}
        onCancel={() => setIpModalOpen(false)}
        footer={null}
        title={`${t("loginLog.usersByIp")} — IP: ${selectedIp}`}
        width={640}
      >
        <Table
          dataSource={ipUsers}
          rowKey={(r) => `${r.user_id}-${r.user}`}
          loading={ipUsersLoading}
          columns={ipUserColumns}
          pagination={false}
          size="small"
        />
      </Modal>
    </>
  );
};

export default List;
