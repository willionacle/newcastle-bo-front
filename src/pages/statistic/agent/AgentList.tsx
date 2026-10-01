import { Tag } from "antd";
import { useState } from "react";
import { agentTagStyle } from "./AgentListStyle";

const dummyData = [
  { id: 1, name: "agent1" },
  { id: 2, name: "agent2" },
];

const AgentList = () => {
  const [select, setSelect] = useState<number | undefined>(undefined);

  return (
    <>
      {dummyData.map((item) => (
        <Tag.CheckableTag
          style={agentTagStyle}
          key={item.id}
          checked={select === item.id}
          onClick={() => setSelect(item.id)}
        >
          {item.name}
        </Tag.CheckableTag>
      ))}
    </>
  );
};

export default AgentList;
