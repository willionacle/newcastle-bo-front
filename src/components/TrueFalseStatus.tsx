import i18next from "@/i18n/i18n";
import { CSSProperties } from "react";

interface Props {
  value: boolean | 0 | 1;
  text?: boolean;
}

const TrueFalseStatus = ({ value, text }: Props) => {
  const style: CSSProperties = {
    background: value ? "var(--ant-color-success)" : "var(--ant-color-error)",
    height: "1rem",
    width: "1rem",
    borderRadius: "9999px",
    marginInline: "auto",
  };
  if (text) {
    return value ? i18next.t("status.use") : i18next.t("status.unused");
  } else {
    return <div style={style}></div>;
  }
};

export default TrueFalseStatus;
