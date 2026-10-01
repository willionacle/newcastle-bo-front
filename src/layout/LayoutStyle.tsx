import { CSSProperties } from "react";

// Shell layout uses flexbox sizing (flex + minHeight:0) instead of stacked
// `calc(100vh - <magic px>)` chains. The old chain duplicated the Header's
// pixel height (50/260) and antd's `--ant-layout-header-height` var (which
// never matched) across three files; on short/mobile viewports the chain
// could resolve to ~0 and, combined with `body { overflow: hidden }` in
// index.css, left the content pane blank with no way to scroll to it.
// Flex-based sizing self-corrects regardless of Header height or viewport
// quirks (mobile dynamic toolbar, etc).
export const rightLayoutStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
};

export const contentLayoutStyle: CSSProperties = {
  marginTop: "0.5rem",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
};

export const contentScrollStype: CSSProperties = {
  flex: 1,
  minHeight: 0,
  padding: "0.5rem",
};
