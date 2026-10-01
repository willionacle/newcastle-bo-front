import i18next from "@/i18n/i18n";
import { Tag } from "antd"


const matchStatusColor: Record<string, Record<string, string | undefined>> = {
  "Opened": {
    color: "blue",
    text: i18next.t("global.waiting"),
  },
  "Lost": {
    color: "red",
    text: i18next.t("sportsBet.lose"),
  },
  "Won": {
    color: "green",
    text: i18next.t("sportsBet.win"),
  },
  "Canceled": {
    color: "yellow",
    text: i18next.t("global.cancel"),
  },
  "Cashout": {
    color: "purple",
    text: i18next.t("title.cashout"),
  },
  "Half Lost": {
    color: "pink",
    text: i18next.t("betting.halfLose"),
  },
  "Half Won": {
    color: "indigo",
    text: i18next.t("sportsMarket.halfWin"),
  },
}

const StatusTag = ({value}:{value:string}) => <Tag color={matchStatusColor[value]?.color} >{matchStatusColor[value]?.text}</Tag>

export default StatusTag;