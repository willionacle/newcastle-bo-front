import i18next from "@/i18n/i18n";
import { ResPostList, SWRType } from "@/api/types";
import { WithdrawalLogData } from "@/api/withdrawal-logs/get";
// import { getTreeDepth } from "@/components/AgentGrade";
import ChangePaymentState from "@/components/ChangePaymentState";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import DetailBtn from "@/components/DetailBtn";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";
import StateTag from "../StateTag";
import { GF } from "@/utils/GlobalFunctions";
import ColorizeUsername from "@/components/ColorizeUsername";
import AgentUsername from "@/components/AgentUsername";

interface Props {
  data: ResPostList["data"];
  loading: boolean;
  pagination: PaginationProps;
  mutate: KeyedMutator<SWRType<ResPostList[]>>;
}

const List = ({ data, loading, mutate, pagination }: Props) => {
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
      render: (value, record) => <AgentUsername treeDepth={record.tree_depth} username={value} />,
    },
    {
      title: t("deposit.de008"),
      dataIndex: "user_real_name",
      align: "center",
      render: (_value, record) => <ColorizeUsername username={record.username} returnRealName />
    },
    {
      title: t("col.level"),
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
          :  GF.topAgentUsername(value.agent_username),
    },
    {
      title: t("deposit.de013"),
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
      title: t("deposit.de002"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: WithdrawalLogData["status"], record) => {
        if (value === "Applied" || value === "Waiting") {
          return (
            <>
              <ChangePaymentState
                id={record.id}
                value={value}
                payment={"AGENT"}
                mutate={mutate}
              />
              <StateTag value={value} />
            </>
          );
        }

        return <StateTag value={value} />;
      },
    },
    {
      title: t("deposit.de017"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("deposit.de018"),
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("deposit.de009"),
      dataIndex: "admin_username",
      key: "admin_id",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      render: (_, record) => <DetailBtn link={record.username} />,
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

export default List;
