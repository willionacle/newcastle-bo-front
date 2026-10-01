import { CSSProperties } from "react";

export const textareaStyle: CSSProperties = {
  height: "120px",
};

export const noteTextareaStyle = (height: number): CSSProperties => ({
  ...textareaStyle,
  height: `${height}px`,
});
