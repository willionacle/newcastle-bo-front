import AgentUsername from "@/components/AgentUsername";
import i18next from "@/i18n/i18n";
import CommaNumber from "@/components/CommaNumber";
import CommaNumber2 from "@/components/CommaNumber2";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

type DataType = {
  id: number;
  created_at: string;
  agent_username: string;
  user_real_name: string;
  date: string;
  tree_depth: number;
  u_deposit_sum: number;
  u_withdrawal_sum: number;
  u_winlose: number;
  agent_withdrawal_sum: number;
  deposit_sum: number;
  dw_sum: number;
  withdrawal_sum: number;
};

interface Props {
  data?: DataType[];
  loading?: boolean;
  onHeaderCell: OnHeaderCellType;
}

const List = ({ data, loading, onHeaderCell }: Props) => {
  const { t } = useTranslation();

  const newDataSource = data || [];

  const columnsArray: ColumnsType<DataType> = [
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (newDataSource.length ?? 0) + 1 - (index + 1),
    },
    {
      title: t("col.agentId"),
      align: "center",
      dataIndex: "agent_username",
      key: "agent_username",
      render: (value, record) => <AgentUsername treeDepth={record.tree_depth} username={value} />,
    },
    {
      title: t("col.name"),
      align: "center",
      dataIndex: "user_real_name",
      key: "user_real_name",
    },
    {
      title: i18next.t("col.level"),
      dataIndex: "tree_depth",
      key: "tree_depth",
      align: "center",
    },
    {
      title: i18next.t("col.parent"),
      dataIndex: "top_agent_username",
      key: "top_agent_username",
      align: "center",
      render: (value: string) => GF.topAgentUsername(value),
    },
    {
      title: t("agentStatistics.ads006"),
      align: "center",
      dataIndex: "deposit_sum",
      key: "deposit_sum",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
    {
      title: t("agentStatistics.ads007"),
      align: "center",
      dataIndex: "withdrawal_sum",
      key: "withdrawal_sum",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
    {
      title: t("agentStatistics.ads008"),
      align: "center",
      dataIndex: "dw_sum",
      key: "dw_sum",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
    {
      title: t("agentStatistics.ads016"),
      align: "center",
      dataIndex: "agent_withdrawal_sum",
      key: "agent_withdrawal_sum",
      render: (value: number) => <CommaNumber2 value={value} onlyNumber />,
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      className="summary-at-top"
      dataSource={newDataSource}
      columns={columns}
      loading={loading}
      rowKey={(record, index) =>
        `${record.id}-${record.agent_username}-${record.date}-${index}`
      }
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={false}
      summary={(data) => {
        let depositSum = 0;
        let withdrawSum = 0;
        let dwSum = 0;
        let agentWithdrawSum = 0;

        data.forEach((item) => {
          // depositSum += item.u_deposit_sum ?? 0;
          depositSum += item.deposit_sum ?? 0;
          withdrawSum += item.withdrawal_sum ?? 0;
          // uWinLoseSum += item.u_winlose ?? 0;
          dwSum += item.dw_sum ?? 0;
          agentWithdrawSum += item.agent_withdrawal_sum ?? 0;
        });

        return (
          <Table.Summary.Row className="font-bold custom-summary">
            <Table.Summary.Cell index={0} align="center"></Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="center"></Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center"></Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center"></Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="center">
              {i18next.t("col.total")}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5} align="center">
              {<CommaNumber value={depositSum} onlyNumber />}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6} align="center">
              {<CommaNumber value={withdrawSum} onlyNumber />}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7} align="center">
              {<CommaNumber value={dwSum} onlyNumber />}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={8} align="center">
              {<CommaNumber value={agentWithdrawSum} onlyNumber />}
            </Table.Summary.Cell>{" "}
            {/* Fixed index */}
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export default List;
