import { AgentType } from "@/api/types";
import AgentGrade, { getTreeDepth } from "@/components/AgentGrade";
import { Tree, TreeDataNode, TreeProps } from "antd";
import { DataNode } from "antd/es/tree";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  useSearchParams,
  useLocation,
  // useNavigate
} from "react-router-dom";
interface Props {
  agents: any;
  depth: number;
  depthData: AgentType[];
  path?: string;
  setAgentId: Dispatch<SetStateAction<string | undefined>>;
  setDepth: Dispatch<SetStateAction<number>>;
  setID: Dispatch<SetStateAction<number | undefined | null>>;
}

interface Agent {
  id: number;
  username: string;
  path: string;
  tree_depth: number;
  [key: string]: any;
}

interface TreeNodeData extends DataNode {
  data?: Agent;
}

const titleStyle: CSSProperties = {
  marginLeft: "0.25rem",
};

const buildTree = (agent: Agent[], selectPath?: string) => {
  const map: Record<string, TreeNodeData> = {};
  const expandKey: string[] = [""];
  const sortAgent = agent.sort(
    (a, b) => getTreeDepth(a.path) - getTreeDepth(b.path)
  );

  sortAgent.forEach((user) => {
    // console.log(user)
    const paths = user && user.path ? user.path.split(",") : [];
    let currentNode: DataNode | undefined = undefined;

    paths.forEach((_, index) => {
      const currentKey = paths.slice(0, index + 1).join(",");

      if (!map[currentKey]) {
        map[currentKey] = {
          key: currentKey,
          icon: <AgentGrade paths={user.path} />,
          title: (
            <span style={titleStyle}>
              {user.username === "master"
                ? import.meta.env.VITE_AGENT_TOP
                : `${user.username} (${user.user_real_name})`}
            </span>
          ),
          children: [],
          data: user,
        };

        if (selectPath && selectPath.includes(currentKey)) {
          expandKey.push(user.path);
        }
      }

      if (currentNode) {
        if (!currentNode.children) {
          currentNode.children = [];
        }

        if (!currentNode.children.some((child) => child.key === currentKey)) {
          currentNode.children.push(map[currentKey]);
        }
      }

      currentNode = map[currentKey];
    });
  });

  const treeData = Object.values(map).filter((node) => {
    return String(node.key) === String(node.key).split(",")[0];
  });

  // const top = [
  //   {
  //     title: <span style={titleStyle}>kosca</span>,
  //     icon: <AgentGrade paths="" isTop />,
  //     key: "",
  //     children: [...treeData],
  //   },
  // ];

  return {
    treeData: treeData,
    expandKey,
  };
};

const AgentTreeView = ({ agents, setAgentId, setDepth, setID }: Props) => {
  // const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const [treeData, setTreeData] = useState(agents);
  const [expandKeys, setExpandKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const agentId = searchParams.get("agent_id");
  const treeKey = searchParams.get("key");

  const handleSelectTree: TreeProps["onSelect"] = (_, info) => {
    const node = info.node as TreeDataNode & { data?: AgentType };
    // if (node.data?.path == "1") {
    //   navigate(path);
    //   setAgentId("");
    //   setDepth(1);
    //   setID(null);
    // } else {
    //   setAgentId(node.data?.username);
    //   setDepth(node.data ? node.data.tree_depth : 1);
    //   setID(node.data ? node.data?.id : null);
    //   // searchParams.set("agent_id", node.data ? node.data.id.toString() : "");
    //   searchParams.set(
    //     "agent_id",
    //     (path == "/agent" ? node?.data?.id.toString() : node.data?.username) ??
    //       ""
    //   );
    //   searchParams.set("key", node.key.toString());

    //   setSearchParams(searchParams);
    // }

    setAgentId(node.data?.username);
    setDepth(node.data ? node.data.tree_depth : 1);
    setID(node.data ? node.data?.id : null);
    // searchParams.set("agent_id", node.data ? node.data.id.toString() : "");
    searchParams.set(
      "agent_id",
      (path == "/agent" ? node?.data?.id.toString() : node.data?.username) ?? ""
    );
    searchParams.set("key", node.key.toString());

    setSearchParams(searchParams);
    setSelectedKeys(node.data ? [node.key.toString()] : []);
  };

  useEffect(() => {
    if (agents) {
      const { treeData, expandKey } = buildTree(agents, treeKey ?? undefined);
      setTreeData(treeData);
      setExpandKeys([...expandKey]);
    }
  }, [agents]);

  useEffect(() => {
    if (agentId) {
      setAgentId(agentId);
      setID(Number(agentId));
    }

    if (treeKey) {
      setSelectedKeys([treeKey]);
    }
  }, [agentId, treeData]);

  return (
    <Tree
      treeData={treeData}
      onSelect={handleSelectTree}
      selectedKeys={selectedKeys}
      showIcon
      expandedKeys={expandKeys}
      onExpand={(_, info) => {
        setExpandKeys((old) => {
          if (old.includes(info.node.key.toString())) {
            return old.filter((item) => item !== info.node.key);
          } else {
            return [...old, info.node.key.toString()];
          }
        });
      }}
    />
  );
};

export default AgentTreeView;
