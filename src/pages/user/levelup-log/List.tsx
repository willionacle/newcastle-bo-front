import AgentUsername from "@/components/AgentUsername";
import i18next from "@/i18n/i18n";
import ColorizeUsername from "@/components/ColorizeUsername";
import DateText from "@/components/DateText";
import { updateLevelupCouponStatus } from "@/api/coupon/patch";
import { Button, message, Space, Table, TableProps, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const List = ({ data, loading, onHeaderCell, pagination, mutate }: any) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogOnlyCreate = async (record: any) => {
    try {
      await updateLevelupCouponStatus({
        logId: record.log_id,
        username: record.username,
      });
      message.success(t("toast.user.logCreated"));
      mutate?.();
    } catch (error: any) {
      message.error(error?.response?.data?.message || t("toast.user.logCreateFailed"));
    }
  };
  const columnsArray: TableProps<any>["columns"] = [
    { 
      title: i18next.t("col.agent"), 
      dataIndex: "agent_username", 
      key: "agent_username", 
      align: "center",
      render: (value, record) => <AgentUsername treeDepth={record.tree_depth} username={value} />,
    },
    { 
      title: "ID", 
      dataIndex: "username", 
      key: "username", 
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    { 
      title: i18next.t("col.name"), 
      dataIndex: "user_real_name", 
      key: "user_real_name", 
      align: "center",
      render: (value) => <ColorizeUsername username={value} returnRealName />
    },
    { 
      title: i18next.t("title.previousLevelAlt"), 
      dataIndex: "current_level", 
      key: "current_level", 
      align: "center" 
    },
    { 
      title: i18next.t("title.nextLevel"), 
      dataIndex: "next_level", 
      key: "next_level", 
      align: "center" 
    },
    { 
      title: i18next.t("levelSetting.lvs012"), 
      dataIndex: "isCoupon", 
      key: "isCoupon", 
      align: "center",
      render: (value: boolean) => <Tag color={value ? 'success' : 'error'}>{value ? i18next.t("moneyType.pay") : i18next.t("moneyType.unpaid")}</Tag>,
    },
    {
      title: i18next.t("col.createdDate"),
      dataIndex: "attempt_date",
      key: "attempt_date",
      align: "center",
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        !record.isCoupon ? (
          <Space>
            <Button size="small" onClick={() => navigate(`/promotion/coupon/create?level_id=${record.log_id}&username=${record.username}`)}>{i18next.t("promotion.couponPay")}</Button>
            <Button size="small" onClick={() => handleLogOnlyCreate(record)}>{i18next.t("user.createLogOnly")}</Button>
          </Space>
        ) : ''
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
      loading={loading}
      rowKey={"log_id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
