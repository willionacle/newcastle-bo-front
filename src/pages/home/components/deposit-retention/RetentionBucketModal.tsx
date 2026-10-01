import { useState } from "react";
import {
  Button,
  Modal,
  notification,
  Table,
  TableColumnGroupType,
  TableColumnType,
  TableProps,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  downloadRetentionUsersExport,
  fileNameFromDisposition,
  RetentionUser,
  useRetentionBucketUsers,
} from "@/api/dashboard/deposit-retention";
import CommaNumber from "@/components/CommaNumber";
import type { ModalState } from "./DepositRetentionStats";

interface Props {
  modalState: ModalState;
  onClose: () => void;
}

type SortKey = "depositTotal" | "dwSum" | "userGrade";

const RetentionBucketModal = ({ modalState, onClose }: Props) => {
  const { t } = useTranslation();
  const { type, bucketKey, bucketLabel, sectionLabel, startDate, endDate } = modalState;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sort, setSort] = useState<{ columnBy?: SortKey; orderBy: "asc" | "desc" }>({
    orderBy: "desc",
  });

  const { users, totalitems, isLoading } = useRetentionBucketUsers(
    type,
    bucketKey,
    startDate,
    endDate,
    page,
    limit,
    sort.columnBy,
    sort.orderBy
  );

  const changeSortKey = (key: SortKey) => {
    setSort((prev) =>
      prev.columnBy === key
        ? { columnBy: key, orderBy: prev.orderBy === "desc" ? "asc" : "desc" }
        : { columnBy: key, orderBy: "desc" }
    );
    setPage(1);
  };

  const onHeaderCell = <T,>(column: TableColumnType<T> | TableColumnGroupType<T>) => ({
    onClick: () => changeSortKey(column.key as SortKey),
    style: { cursor: "pointer" },
  });

  const sortOrderOf = (key: SortKey) =>
    sort.columnBy === key ? (sort.orderBy === "asc" ? "ascend" : "descend") : null;

  const columns: TableProps<RetentionUser>["columns"] = [
    {
      title: "No",
      key: "no",
      align: "center",
      width: 50,
      render: (_v, _r, idx) => (page - 1) * limit + idx + 1,
    },
    {
      title: t("col.id", "아이디"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (v, record) => <Link to={`/user/${record.user_id}`}>{v}</Link>,
    },
    {
      title: t("col.name", "이름"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
    },
    {
      title: t("topNavi.tn023", "총입금"),
      dataIndex: "total_deposit",
      key: "depositTotal",
      align: "center",
      sorter: true,
      sortOrder: sortOrderOf("depositTotal"),
      onHeaderCell,
      render: (v) => <CommaNumber value={v} onlyNumber />,
    },
    {
      title: t("depositRetention.inOutDiff", "총입출차액"),
      dataIndex: "in_out_diff",
      key: "dwSum",
      align: "center",
      sorter: true,
      sortOrder: sortOrderOf("dwSum"),
      onHeaderCell,
      render: (v) => <CommaNumber value={v} onlyNumber />,
    },
    {
      title: t("depositRetention.lastDepositMethod", "입금 방식"),
      dataIndex: "last_deposit_method",
      key: "last_deposit_method",
      align: "center",
    },
    {
      title: t("depositRetention.tendency", "참고성향"),
      dataIndex: "tendency",
      key: "tendency",
      align: "center",
    },
    {
      title: t("depositRetention.mainGame", "주게임"),
      dataIndex: "main_game",
      key: "main_game",
      align: "center",
    },
    {
      title: t("col.grade", "등급"),
      dataIndex: "grade",
      key: "userGrade",
      align: "center",
      sorter: true,
      sortOrder: sortOrderOf("userGrade"),
      onHeaderCell,
    },
    {
      title: t("col.level", "레벨"),
      dataIndex: "level",
      key: "level",
      align: "center",
    },
  ];

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const res = await downloadRetentionUsersExport(type, bucketKey, startDate, endDate);
      const fileName = fileNameFromDisposition(
        res.headers["content-disposition"],
        `${sectionLabel}_${bucketLabel}.xlsx`
      );

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      notification.error({
        message: t("depositRetention.downloadFailed", "다운로드 실패"),
        description: t(
          "depositRetention.downloadFailedDesc",
          "회원 정보를 다운로드하는 중 오류가 발생했습니다."
        ),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal
      open
      title={t("depositRetention.modalTitle", "{{section}} - {{bucket}} 유저 목록", {
        section: sectionLabel,
        bucket: bucketLabel,
      })}
      onCancel={onClose}
      width={980}
      footer={null}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          loading={isDownloading}
          disabled={isDownloading || totalitems === 0}
        >
          {t("depositRetention.excelDownload", "엑셀 다운로드")}
        </Button>
      </div>
      <Table
        rowKey="user_id"
        dataSource={users}
        columns={columns}
        size="small"
        loading={isLoading}
        showSorterTooltip={false}
        pagination={{
          current: page,
          pageSize: limit,
          total: totalitems,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          onChange: (newPage, newPageSize) => {
            if (newPageSize !== limit) {
              setLimit(newPageSize);
              setPage(1);
            } else {
              setPage(newPage);
            }
          },
        }}
        scroll={{ x: true }}
      />
    </Modal>
  );
};

export default RetentionBucketModal;
