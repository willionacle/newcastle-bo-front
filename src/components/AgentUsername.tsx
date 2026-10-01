import { Flex } from "antd"
// import { CSSProperties } from "react";
// import { green } from "@ant-design/colors";
import { GF } from "@/utils/GlobalFunctions";

interface Props {
  treeDepth?: number | null;
  username?: string | null;
}

// const depthStyle = (treeDepth: number): CSSProperties => ({
//     borderRadius: "calc(var(--ant-border-radius) / 3)",
//     textAlign: "center",
//     background: green[9 - treeDepth],
//     height: '1.1rem',
//     width: '1.1rem',
//     fontSize: 10,
//     color:
//     11 - treeDepth > 5 ? "var(--ant-color-white)" : "var(--ant-color-text-base)",
// })

const AgentUsername = ({username}: Props) => {
  // const isTop = username === "master" || treeDepth === 0;

  return (
    <Flex gap={4} align="center" justify="center">
      {/* {treeDepth && (
        <div className="" style={depthStyle(treeDepth)}>{!isTop ? treeDepth : 'HQ'}</div>
      )} */}
      <div className="" style={{minWidth: 60, textAlign: 'center'}}>{username ? GF.topAgentUsername(username ?? "") : '-'}</div>
    </Flex>
  )
}

export default AgentUsername;