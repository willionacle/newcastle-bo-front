import i18next from "@/i18n/i18n";
import { Tag } from "antd";

const STATUS_MAP: Record<number, { text: string; color?: string }> = {
  0: { text: i18next.t("status.undecided"), color: "default" },
  1: { text: i18next.t("sportsBet.win"), color: "green" },
  2: { text: i18next.t("sportsBet.lose"), color: "red" },
};

export const StatusTag = ({ status }: { status: number }) => {
  const { text, color } = STATUS_MAP[status];
  return <Tag color={color}>{text}</Tag>;
};
