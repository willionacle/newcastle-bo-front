import i18next from "@/i18n/i18n";
import { Divider, Flex, Popover } from "antd";
import { handleTextColor } from "../List";
import CommaNumberSpan from "@/components/CommaNumberSpan";
import { SportsMarketData } from "@/api/sport-market/get";
import { useState } from "react";
import SportMarketEventDetails from "./SportMarketEventDetails";

interface Props {
  record: SportsMarketData;
  teamSide: "home" | "away" | "draw";
  clickable?: boolean;
}

function topSection(teamSide: Props["teamSide"], teamName: string, score: string) {

  if (teamSide === "home") {
    return `${teamName} - ${score?.split(":")?.[0] || ""}`;
  } else if (teamSide === "away") {
    return `${score?.split(":")?.[1] || ""} - ${teamName}`;
  } else {
    return `vs`;
  }
}

const OpenSettledAmounts = ({teamSide, record, clickable}: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!clickable) return;
    setOpen(newOpen);
  };

  const isHome = teamSide === "home";
  const isAway = teamSide === "away";
  // const isDraw = teamSide === "draw";
  const hasAmountTitle =  isHome;
  const teamName = isHome ? record.homeName : isAway ? record.awayName : "vs";

  const amount = {
    openedAmount1: isHome ? record.opened_homeBetSum : isAway ? record.opened_awayBetSum : record.opened_drawBetSum,
    openedAmount2: isHome ? record.opened_homeWinSum : isAway ? record.opened_awayWinSum : record.opened_drawWinSum,
    settledAmount1: isHome ? record.settled_homeBetSum : isAway ? record.settled_awayBetSum : record.settled_drawBetSum,
    settledAmount2: isHome ? record.settled_homeWinSum : isAway ? record.settled_awayWinSum : record.settled_drawWinSum,
  }

  return (
    <>
      <div className="font-bold">{topSection(teamSide, teamName, record.score)}</div>
      <Divider style={{marginTop: 4, marginBottom: 4}} />
      {(
        Number(amount.openedAmount1) > 0 ||
        Number(amount.openedAmount2) > 0 ||
        Number(amount.settledAmount1) > 0 ||
        Number(amount.settledAmount2) > 0 
      ) ? (
        <Popover 
          content={<SportMarketEventDetails parentRecord={record} teamSide={teamSide} />} 
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
          destroyTooltipOnHide
        >
          <div className={`amount-wrapper ${clickable ? "hoverable" : ""}`}>
              <div className="amount-container">
                {hasAmountTitle && (
                  <span className="market-amount-label" style={{ color: handleTextColor(-1) }}>{i18next.t("sportsMarket.betAmountOpenSettled")}</span>
                )}
                  <span className="market-amount" style={{ color: handleTextColor(1, true) }}> 
                    <CommaNumberSpan value={Number(amount.openedAmount1)} /> 
                  </span>
                  <span className="market-amount-separator"> | </span>
                  <span className="market-amount" style={{ color: handleTextColor(amount.settledAmount1) }}>
                    <CommaNumberSpan value={Number(amount.settledAmount1)} />
                  </span>
              </div>
              <div className="amount-container">
                  {hasAmountTitle && (
                    <span className="market-amount-label" style={{ color: "var(--ant-color-success-text)"}}>{i18next.t("sportsMarket.resultOpenSettled")}</span>
                  )}              
                  <span className="market-amount" style={{ color: handleTextColor(1, true) }}>
                    <CommaNumberSpan value={Number(amount.openedAmount2)} />
                  </span>
                  <span className="market-amount-separator"> | </span>
                  <span className="market-amount" style={{ color: handleTextColor(amount.settledAmount2) }}>
                    <CommaNumberSpan value={Number(amount.settledAmount2)} />
                  </span>
              </div>
          </div>
        </Popover>
      ) : (
        <Flex align="center" justify="center" style={{height: 48}}>-</Flex>
      )}
    </>
  );
};

export default OpenSettledAmounts;