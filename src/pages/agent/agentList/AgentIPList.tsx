import { AgentType } from "@/api/types";
import { deleteWhiteList } from "@/api/whiteLists/delete";
import { WhiteListData, whiteListDataAPI } from "@/api/whiteLists/get";
import ColorizeUsername from "@/components/ColorizeUsername";
import DeleteBtn from "@/components/DeleteBtn";
import useUserStore from "@/store/user.store";
import { Space, Table, TableProps } from "antd";
import { stringify } from "qs";
import { useTranslation } from "react-i18next";

const query = (agent_username: Props["agent_username"]) => {
  const userid = useUserStore.getState().userid;
  if (!agent_username) return "";

  const queryData = {
    username  : agent_username,
    userid    : userid,
    page      : 1,
    limit     : 100,
    orderby   : 'desc',
    columnby  : 'id',
    ip        : null
  };

  return stringify(queryData, { encodeValuesOnly: true });
};

interface Props {
  agent_username: AgentType["agent_username"] | undefined;
}

const AgentIPList = ({ agent_username }: Props) => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = whiteListDataAPI(query(agent_username));

  const handleDelete = async (id: WhiteListData["id"]) => {
    const res = await deleteWhiteList(id);

    if (res) {
      mutate();
    }
  };

  const columns: TableProps<WhiteListData>["columns"] = [
    {
      title: t("agent.al003"),
      dataIndex: "username",
      align: "center",
      width: 120,
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("agent.al015"),
      dataIndex: "ip",
      align: "center",
      width: 200,
      render: (value: WhiteListData["ip"]) => value ?? "-",
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      width: 40,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <DeleteBtn handleDelete={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      sticky 
      columns={columns}
      loading={isLoading}
      dataSource={data?.data}
      tableLayout="fixed"
      scroll={{ x: "100%" }}
      rowKey={"id"}
    />
  );
};

export default AgentIPList;
