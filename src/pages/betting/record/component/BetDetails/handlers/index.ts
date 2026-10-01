import i18next from "@/i18n/i18n";
import { TagProps } from "antd";
import { BetDetailStatus } from "../../../types";
import { BetLogData } from "@/api/betting-logs/get";

export const handleStatusTagProps = (tbxi_status: BetDetailStatus) => {
    let color: TagProps['color'] = 'default';
    let str = (tbxi_status ?? '').toLocaleLowerCase();

    switch (tbxi_status) {
      case 'Opened':
        color = "blue";
        str = i18next.t("global.waiting")
        break;
      case 'Lost':
        color = "error";
        str = i18next.t("sportsBet.lose")
        break;
      case 'Won':
        color = "success";
        str = i18next.t("sportsBet.win")
        break;
      case 'Canceled':
        color = "warning";
        str = i18next.t("global.cancel")
        break;
      case 'Cashout':
        color = "purple";
        str = i18next.t("title.cashout")
        break;
      case 'Half Lost':
        color = "magenta";
        str = i18next.t("betting.halfLose")
        break;
    
      default:
        color;
        str;
        break;
    }

    return {
      color,
      str
    }
}

export const convertBetDetailsStatus = (status: BetLogData['status']) => {
  let newStatus: BetDetailStatus = 'Opened';
  if (status === "LOSE") newStatus = 'Won';
  else if (status === "WAITING") newStatus = "Opened";
  else if (status === "WIN") newStatus = 'Lost';
  else if (status === "CANCEL") newStatus = "Canceled";
  else if (status === "DRAW") newStatus = i18next.t("sportsBet.draw");
  else if (status === "TIE") newStatus = i18next.t("betting.turn_draw"); 
  else if (status === "TRANSFER") newStatus = i18next.t("betting.transfer");

  return newStatus;
}