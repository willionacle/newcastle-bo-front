import i18next from "@/i18n/i18n";
import { Tabs } from "antd";

import TicketsList from "./tickets/List";
import SettlementsList from "./settlements/List";
import BonusList from "./bonus/List";

/** Sportsbook v3 sub-tab embedded in the member detail page. */
const SportsV3UserTab = ({ username }: { username?: string }) => {
  if (!username) return null;
  return (
    <Tabs
      defaultActiveKey="tickets"
      items={[
        { key: "tickets", label: i18next.t("sidemenu.bettingTickets"), children: <TicketsList username={username} /> },
        { key: "settlements", label: i18next.t("sidemenu.settlementCashout"), children: <SettlementsList username={username} /> },
        { key: "bonus", label: i18next.t("sidemenu.bonus"), children: <BonusList username={username} /> },
      ]}
    />
  );
};

export default SportsV3UserTab;
