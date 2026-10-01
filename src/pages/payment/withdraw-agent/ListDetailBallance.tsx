import i18next from "@/i18n/i18n";
import { ResPostList, SWRType } from "@/api/types";
import { WithdrawalLogData } from "@/api/withdrawal-logs/get";
import ColorizeUsername from "@/components/ColorizeUsername";
// import { getTreeDepth } from "@/components/AgentGrade";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { GF } from "@/utils/GlobalFunctions";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: ResPostList["data"];
  loading: boolean;
  pagination: PaginationProps;
  mutate: KeyedMutator<SWRType<ResPostList[]>>;
}

const ListDetailBallance = ({ data, loading, pagination }: Props) => {
  const { t } = useTranslation();
  const { current = 1, defaultPageSize = 10 } = pagination;

  const columnsArray: TableProps<WithdrawalLogData>["columns"] = [
    {
      title: t("NO."),
      key: "id",
      align: "center",
      render: (_, __, index) =>
        (index + 1 + (current - 1) * defaultPageSize).toLocaleString(),
    },
    {
      title: t("col.agentId"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("deposit.de008"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
      render: (_, record) => <ColorizeUsername username={record.username} returnRealName />
    },
    {
      title: t("deposit.de019"),
      dataIndex: "tree_depth",
      align: "center",
    },
    {
      title: t("col.parent"),
      dataIndex: "agent_username",
      align: "center",
      render: (_, value: any) =>
        value.tree_depth && value?.agent_username === ""
          ? i18next.t("payment.headquarters")
          : GF.topAgentUsername(value.agent_username),
    },
    {
      title: t("col.amount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => (
        <span className="text-color-brown font-bold">
          <CommaNumber value={value} />
        </span>
      ),
    },
    {
      title: t("col.content"),
      dataIndex: "system_note",
      align: "center",
    },
    {
      title: t("col.dateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} />,
    },
  ];

  // const columns = columnsArray.map((item) =>
  //   item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  // );

  return (
    <>
      <Table
      sticky
        columns={columnsArray}
        loading={loading}
        dataSource={data}
        tableLayout="auto"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
        rowKey={"id"}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "white-row" : "gray-row"
        }
        style={{
          marginTop: "1rem",
        }}
      />
    </>
  );
};

export default ListDetailBallance;
