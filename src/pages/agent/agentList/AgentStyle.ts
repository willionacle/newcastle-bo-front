import { CSSProperties } from "react";

export const rowStyle: CSSProperties = {
  background: "var(--ant-color-fill-secondary)",
  borderTopLeftRadius: "var(--ant-border-radius)",
  borderTopRightRadius: "var(--ant-border-radius)",
};

export const colStyle: CSSProperties = {
  paddingBlock: "1rem",
  borderBottom: "solid 1px var(--ant-color-split)",
};

export const titleColStyle: CSSProperties = {
  ...colStyle,
  textAlign: "center",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const titleColStyle2: CSSProperties = {
  textAlign: "center",
  fontWeight: "bold",
};

export const urlWrapper: CSSProperties = {
  overflow: "hidden",
};
