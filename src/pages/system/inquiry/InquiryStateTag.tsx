import i18next from "@/i18n/i18n";
import { InquiryStatus } from "@/api/inquiry/get";
import { CSSProperties } from "react";

interface Props {
  value: InquiryStatus;
}

const InquiryStateTag = ({ value }: Props) => {
  const style: CSSProperties = {
    borderRadius: "calc(var(--ant-font-size-sm) / 2)",
    border: "solid 1px var(--ant-color-split)",
    width: "fit-content",
    paddingInline: "1rem",
    marginInline: "auto",
    fontSize: "var(--ant-font-size-sm)",
    color: "var(--ant-color-text-secondary)",
    background: "transparent",
    whiteSpace: "nowrap",
  };
  let label = "";

  switch (value) {
    case "pending":
      style.border = "solid 1px var(--ant-color-warning-border)";
      style.color = "var(--ant-color-warning-text)";
      style.background = "var(--ant-color-warning-bg)";
      label = i18next.t("inquiry.statusPending");
      break;

    case "answered":
      style.border = "solid 1px var(--ant-color-success-border)";
      style.color = "var(--ant-color-success-text)";
      style.background = "var(--ant-color-success-bg)";
      label = i18next.t("inquiry.statusAnswered");
      break;

    case "closed":
      style.border = "solid 1px var(--ant-color-error-border)";
      style.color = "var(--ant-color-error-text)";
      style.background = "var(--ant-color-error-bg)";
      label = i18next.t("inquiry.statusClosed");
      break;

    default:
      break;
  }

  return <div style={style}>{label}</div>;
};

export default InquiryStateTag;
