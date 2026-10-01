import { ProofReport, ProofReportStatus } from "@/api/proof-reports/get";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import NavClickable from "@/components/NavClickable";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps, Tag, Tooltip } from "antd";
import { PaginationProps } from "antd/lib";
import dayjs from "dayjs";
import { stringify } from "qs";
import { useTranslation } from "react-i18next";
import RetryButton from "./RetryButton";

interface Props {
  data: ProofReport[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  onRetried: () => void;
}

const STATUS_COLOR: Record<ProofReportStatus, string> = {
  ok: "green",
  failed: "red",
  skipped: "orange",
};

// 입출금 목록에는 id 검색이 없으므로 아이디 + 그날 하루 범위로 되돌아간다.
// 입금은 dateRange, 출금은 dateRangeW 를 쓴다 (각 화면의 필터 이름).
const transactionLink = (record: ProofReport) => {
  const day = dayjs(record.createdAt).tz();
  const range = [day.startOf("day").format(), day.endOf("day").format()];

  return record.direction === "deposit"
    ? `/payment?${stringify({ dateRange: range, username: record.username })}`
    : `/payment/withdraw?${stringify({
        dateRangeW: range,
        username: record.username,
      })}`;
};

const List = ({
  data,
  loading,
  pagination,
  onHeaderCell,
  onRetried,
}: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<ProofReport>["columns"] = [
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
      title: t("col.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 90,
      render: (value: ProofReportStatus) => {
        const tag = <Tag color={STATUS_COLOR[value]}>{t(`proofReport.status.${value}`)}</Tag>;

        // skipped 는 실패가 아니지만 그대로 두면 보고되지 않은 채 남는다.
        // 대부분 회원 계좌정보 누락이라 운영자가 채워 넣고 재전송하면 된다.
        return value === "skipped" ? (
          <Tooltip title={t("proofReport.skippedHint")}>{tag}</Tooltip>
        ) : (
          tag
        );
      },
    },
    {
      title: t("proofReport.direction"),
      dataIndex: "direction",
      key: "direction",
      align: "center",
      width: 80,
      render: (value: ProofReport["direction"]) =>
        value === "deposit" ? t("col.deposit") : t("topNavi.tn016"),
    },
    {
      title: t("col.username"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value: string | null, record) =>
        value ? (
          <NavClickable to={transactionLink(record)}>{value}</NavClickable>
        ) : (
          "-"
        ),
    },
    {
      title: t("col.amount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number | null) => <CommaNumber value={value} />,
    },
    {
      title: t("proofReport.rowId"),
      dataIndex: "rowId",
      key: "rowId",
      align: "center",
      width: 90,
    },
    {
      title: t("proofReport.vendorRef"),
      dataIndex: "vendorRef",
      key: "vendorRef",
      align: "center",
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("proofReport.error"),
      dataIndex: "error",
      key: "error",
      align: "center",
      width: 240,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("proofReport.attempts"),
      dataIndex: "attempts",
      key: "attempts",
      align: "center",
      width: 70,
    },
    {
      title: t("col.createdDateTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 150,
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("proofReport.retry"),
      key: "action",
      align: "center",
      width: 90,
      // 이미 ok 인 건은 백엔드가 거부하므로 버튼 자체를 내보내지 않는다.
      render: (_value, record) =>
        record.status === "ok" ? (
          "-"
        ) : (
          <RetryButton id={record.id} onRetried={onRetried} />
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
      columns={columns}
      tableLayout="auto"
      rowKey="id"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      style={{ marginTop: "1rem" }}
      pagination={pagination}
    />
  );
};

export default List;
