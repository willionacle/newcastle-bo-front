import { Table, TableProps, Tag, Button, notification } from "antd";
import i18next from "@/i18n/i18n";
import { useState } from "react";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { GradeChangeLog } from "@/api/grade-change-logs/get";
import { issueUpgradeCoupon } from "@/api/upgrade-coupons/post";
import { GF } from "@/utils/GlobalFunctions";

interface Props {
  data: GradeChangeLog[];
  loading: boolean;
  onHeaderCell: any;
  pagination: any;
  mutate: () => void;
}

const List = ({ data, loading, onHeaderCell, pagination, mutate }: Props) => {
  const [issuingCouponId, setIssuingCouponId] = useState<number | null>(null);

  const handleIssueCoupon = async (record: GradeChangeLog) => {
    setIssuingCouponId(record.gradeChangeId);
    try {
      const response = await issueUpgradeCoupon({
        username: record.username,
        grade: record.newGrade,
      });

      if (response.code === 0) {
        notification.success({
          message: i18next.t("toast.coupon.issueSuccess"),
          description: `${record.username}님에게 ${
            record.newGrade
          } 등급 쿠폰이 발급되었습니다. (금액: ${response.data?.amount?.toLocaleString()}원)`,
        });
        mutate(); // Refresh the list
      } else {
        notification.error({
          message: i18next.t("toast.coupon.issueFailed"),
          description: response.message || i18next.t("user.couponIssueError"),
        });
      }
    } catch (error: any) {
      console.error("Coupon issuance error:", error);
      notification.error({
        message: i18next.t("toast.coupon.issueFailed"),
        description:
          error.response?.data?.message || i18next.t("toast.common.networkError"),
      });
    } finally {
      setIssuingCouponId(null);
    }
  };

  const columnsArray: TableProps<GradeChangeLog>["columns"] = [
    {
      title: "No",
      align: "center",
      width: 80,
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 20) -
        index,
    },
    {
      title: i18next.t("col.agent"),
      dataIndex: "agentUsername",
      key: "agentUsername",
      align: "center",
    },
    {
      title: i18next.t("title.userIdTitle"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />,
    },
    {
      title: i18next.t("col.name"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: i18next.t("title.previousGrade"),
      dataIndex: "oldGrade",
      key: "oldGrade",
      align: "center",
      render: (value) => GF.handleGradeStrVal(value),
    },
    {
      title: i18next.t("title.changedGrade"),
      dataIndex: "newGrade",
      key: "newGrade",
      align: "center",
      render: (value) => GF.handleGradeStrVal(value),
    },
    {
      title: i18next.t("title.promoteDemote"),
      dataIndex: "isUpgrade",
      key: "isUpgrade",
      align: "center",
      width: 100,
      render: (value: number) => (
        <Tag color={value === 1 ? "success" : "error"}>
          {value === 1 ? i18next.t("status.promotion") : i18next.t("status.demotion")}
        </Tag>
      ),
    },
    {
      title: i18next.t("title.couponIssue"),
      dataIndex: "canIssueCoupon",
      key: "canIssueCoupon",
      align: "center",
      width: 120,
      render: (value: number, record) => (
        <Tag
          color={value === 1 ? "blue" : record.issuedAt ? "green" : "default"}
        >
          {value === 1 ? i18next.t("status.possible") : record.issuedAt ? i18next.t("global.complete") : i18next.t("status.notPossible")}
        </Tag>
      ),
    },
    {
      title: i18next.t("title.changeDateTime"),
      dataIndex: "changedAt",
      key: "changedAt",
      align: "center",
      width: 180,
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: i18next.t("title.couponIssueDate"),
      dataIndex: "issuedAt",
      key: "issuedAt",
      align: "center",
      width: 180,
      render: (value) => (value ? <DateText date={value} timeStamp /> : "-"),
    },
    {
      title: i18next.t("userGameSettings.action"),
      key: "action",
      align: "center",
      fixed: "right",
      width: 100,
      render: (_, record) =>
        record.canIssueCoupon === 1 && !record.issueId ? (
          <Button
            size="small"
            type="primary"
            loading={issuingCouponId === record.gradeChangeId}
            onClick={() => handleIssueCoupon(record)}
          >
            {i18next.t("promotion.couponPay")}
          </Button>
        ) : null,
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key && item.key !== "No"
      ? { ...item, onHeaderCell }
      : item
  );

  return (
    <Table
      sticky
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="gradeChangeId"
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
