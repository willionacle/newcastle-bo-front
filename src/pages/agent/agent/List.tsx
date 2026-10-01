import { ResPostList } from "@/api/types";
import i18next from "@/i18n/i18n";
import AgentUsername from "@/components/AgentUsername";
import ColorizeUsername from "@/components/ColorizeUsername";
// import { getTreeDepth } from "@/components/AgentGrade";
import CommaNumber2 from "@/components/CommaNumber2";
import DateText from "@/components/DateText";
import DetailBtn from "@/components/DetailBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { PaginationProps, Table } from "antd";
import { TableProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data?: ResPostList['data'];
  loading: boolean;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps["columns"] = [
    {
      title: "NO.",
      dataIndex: "id",
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: i18next.t("col.agentId"),
      dataIndex: "username",
      align: "center",
      render: (value, record) => <AgentUsername treeDepth={record.tree_depth} username={value} />,
    },
    {
      title: i18next.t("col.name"),
      dataIndex: "user_real_name",
      align: "center",
      render: (_value, record) => <ColorizeUsername username={record.username} returnRealName />
    },
    {
      title: i18next.t("col.level"),
      dataIndex: "tree_depth",
      key: "tree_depth",
      align: "center",
      // render: (path) => path ? getTreeDepth(path) : '-',
    },
    {
      title: i18next.t("col.parent"),
      dataIndex: "agent_username",
      key: "agent_username",
      align: "center",
      render: (value: string) => GF.topAgentUsername(value),
    },
    {
      title: i18next.t("col.balance"),
      dataIndex: "balance",
      key: "balance",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
    {
      title: t("col.rollingCommission"),
      dataIndex: "agent_rolling_point",
      key: "agent_rolling_point",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} />,
    },
    {
      title: t("col.losingCommission"),
      dataIndex: "agent_lossing_point",
      key: "agent_lossing_point",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
    {
      title: i18next.t("title.subUserCount"),
      dataIndex: "user_count",
      key: "user_count",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
    {
      title: i18next.t("title.accumulatedSettlement"),
      dataIndex: "agent_balance_total",
      key: "agent_balance_total",
      align: "center",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "user_status",
      key: "user_status",
      align: "center",
      render: (value) => {
        if (value === "ACTIVE") return t("memberInfoEdit.mie010");

        if (value === "DEACTIVATED") return t("memberInfoEdit.mie013");

        if (value === "SUSPENDED") return t("memberInfoEdit.mie012");

        if (value === "UNVERIFIED") return t("memberInfoEdit.mie034");

        if (value === "OBSERVATION") return <span style={{color: 'var(--ant-color-error)'}}>{t("memberInfo.mi036")}</span>;
      },
    },
    {
      title: i18next.t("title.joinDateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("global.action"),
      align: "center",
      key: "action",
      render: (_, record: any) => {
        const key = record.path ? record.path.replace("2223,", "").split(",").join("%2C") : '';

        return <DetailBtn link={`/agent?agent_id=${record.id}&key=${key}`} />;
      },
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
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
