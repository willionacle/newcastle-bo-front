import { green } from "@ant-design/colors";
import { CSSProperties } from "react";

interface Props {
  paths: string;
  msg?: string;
  isTop?: boolean;
}

export const getTreeDepth = (paths: string) => {
  const pathArray = paths ? paths.split(",") : [];

  return pathArray.length;
};

const AgentGrade = ({ paths, msg, isTop }: Props) => {
  let content = "";
  const grade = getTreeDepth(paths);

  const style: CSSProperties = {
    borderRadius: "calc(var(--ant-border-radius) / 2)",
    textAlign: "center",
    background: green[9 - grade],
    color:
      10 - grade > 4 ? "var(--ant-color-white)" : "var(--ant-color-text-base)",
  };

  switch (grade) {
    case -1:
      content = "HQ";
      break;

    default:
      content = String(grade);
  }

  if (isTop) {
    content = "HQ";
  }

  if (msg) {
    style.paddingInline = "0.5rem";
    content = msg;
  } else {
    style.height = "1.5rem";
    style.width = "1.5rem";
  }

  return <div style={style}>{content}</div>;
};

export default AgentGrade;
