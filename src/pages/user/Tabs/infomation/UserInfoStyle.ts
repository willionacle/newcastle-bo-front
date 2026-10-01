import { CSSProperties } from "react";

export const listStyle: CSSProperties = {
  marginBottom: "1rem",
};

export const listItemStyle: CSSProperties = {
  display: "flex",
  margin: 0,
};

export const itemStyle = (title: boolean = false): CSSProperties => ({
  flex: title ? 0.8 : 1.2,
  textAlign: "left",
  background: title ? "var(--ant-color-bg-layout)" : "transparent",
  paddingInline: "1rem",
  lineHeight: "2.5rem",
  height: "2.5rem",
  overflow: "hidden",
  borderBottom: "solid 1px var(--ant-color-split)",
  fontWeight: title ? "bold" : "normal",
});
