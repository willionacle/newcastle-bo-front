import i18next from "@/i18n/i18n";
import { StatsDataType } from "@/api/cs-statics/totalStatics";
import {
  headerListHeaderItemStyle,
  headerListHeaderStyle,
  headerListItemStyle,
  headerListStyle,
  headerListTitleStyle,
  percentageWrapper,
} from "./HeaderStyle";
import { List, Typography } from "antd";
// import { useTranslation } from "react-i18next";
import PercentageColored from "@/components/PercentageColored";
import dayjs from "dayjs";
import { stringify } from "qs";
import LastMonthRate from "@/components/LastMonthRate";
import { CSSProperties } from "react";

interface Props {
  loading: boolean;
  data: StatsDataType | null;
}

export const calculatePercentage = (value: number, total: number): number => {
  return (value / total) * 100;
};

// This tile is a real full-page navigation (see statisticUrl below), so it
// needs its own anchor reset rather than NavClickable/Link.
const LINK_RESET: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
  display: "contents",
};

const HeaderItem4 = ({ data, loading }: Props) => {
  // const navigate = useNavigate();
  // const { t } = useTranslation();

  if (!data) {
    return <div>No data available</div>;
  }

  // const totalBetCount = (data.total_bet_today ?? 0);
  // (data.total_live_bet_today ?? 0) +
  // (data.total_slot_bet_today ?? 0) +
  // (data.total_minigame_bet_today ?? 0) +
  // // (data.btiBetSum?.betSum ?? 0) +
  // (data.total_sport_bet_today ?? 0);

  // const totalWinCount = (data.total_bet_result_today ?? 0);
  // (data.total_live_bet_result_today ?? 0) +
  // (data.total_slot_bet_result_today ?? 0) +
  // (data.total_minigame_bet_result_today ?? 0) +
  // (data.total_sport_bet_result_today ?? 0);

  // const totalBetProfit = (data.total_bet_winlose_today ?? 0);
  // (data.total_live_bet_winlose_today ?? 0) +
  // (data.total_slot_bet_winlose_today ?? 0) +
  // (data.total_minigame_bet_winlose_today ?? 0) +
  // (data.total_sport_bet_winlose_today ?? 0);

  // Full page reload by design (not client-side routed) -- the statistics
  // page needs a fresh load here, so this stays a plain <a href>, not
  // NavClickable/Link. A real href is what makes ctrl/cmd/middle-click open
  // it in a new tab (client request #21) instead of only ever the current one.
  const statisticUrl = (value?: string) => {
    if (!value) return undefined;
    // const startDate = dayjs().startOf("day").toISOString();
    // const endDate = dayjs().endOf("day").toISOString();

    const columnby = value === "live" ? "dw_sum" : "roll_90"
    const vendor_id = value === "live" || value === "slot" ? null : (value || null);
    const game_category = vendor_id ? null : (value || null);

    return `/statistic/user?${stringify({
      dateRange: [
        dayjs().tz().startOf("day").format(),
        dayjs().tz().endOf("day").format(),
      ],
      columnby,
      vendor_id,
      game_category,
      page: 1,
    }, { arrayFormat: "repeat" })}`
    // const url = `/statistic/user/?${param}&dateRange[0]=${encodeURIComponent(
    //   startDate
    // )}&dateRange[1]=${encodeURIComponent(endDate)}`;
  };

  return (
    <div style={{ flex: "auto" }}>
      <ul style={headerListHeaderStyle}>
        <li style={headerListTitleStyle(110)}></li>
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("col.total")}</li>
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("title.live")}</li>
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("memberDetail.mis132")}</li>
        {/* <li style={headerListHeaderItemStyle(1)}>미니게임</li> */}
        {/* Token */}
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("gameCat.token")}</li>
        {/* vr */}
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("gameCat.virtual")}</li>
        {/* Overseas */}
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("header.overseasType")}</li>
        {/* Domestic */}
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("header.domesticType")}</li>
        {/* <li style={headerListHeaderItemStyle(1)}>E-스포츠</li> */}
        
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("status.waiting")}</li>
      </ul>

      <List
        loading={loading}
        dataSource={[
          {
            label: i18next.t("topNavi.tn018"),
            // total: totalBetCount,
            total: Math.round(data.total_bet_today ?? 0).toLocaleString(),
            evo: Math.round(data.total_live_bet_today ?? 0).toLocaleString(),
            pp: Math.round(data.total_slot_bet_today ?? 0).toLocaleString(),
            // mini: Math.round(data.total_minigame_bet_today ?? 0).toLocaleString(), -- All minigames changed to Token
            mini: Math.round(data.total_token_bet_today ?? 0).toLocaleString(),
            btiFinal: Math.round(data.total_sports_bet_today ?? 0).toLocaleString(), // Overseas
            sportsDomestic: Math.round(data.total_sports_domestic_bet_today ?? 0).toLocaleString(), // Domestic
            // esports: Math.round(
            //   data.total_esports_bet_today ?? 0
            // ).toLocaleString(), -- All esports change to VR
            esports: Math.round(
              data.total_vr_bet_today ?? 0
            ).toLocaleString(),
            btiIng: Math.round(data.total_opened_sports_bet_amount_bti ?? 0).toLocaleString() + i18next.t("header.overseasParen"),
          },
          {
            label: i18next.t("topNavi.tn019"),
            // total: totalWinCount,
            total: Math.round(data.total_bet_result_today ?? 0).toLocaleString(),
            evo: Math.round(data.total_live_bet_result_today ?? 0).toLocaleString(),
            pp: Math.round(data.total_slot_bet_result_today ?? 0).toLocaleString(),
            // mini: Math.round(data.total_minigame_bet_result_today ?? 0).toLocaleString(),
            mini: Math.round(data.total_token_bet_result_today ?? 0).toLocaleString(),
            btiFinal: Math.round(data.total_sports_bet_result_today ?? 0).toLocaleString(), // Overseas
            sportsDomestic: Math.round(data.total_sports_domestic_result_today ?? 0).toLocaleString(), // Domestic
            // esports: Math.round(
            //   data.total_esports_bet_result_today ?? 0
            // ).toLocaleString(),
            esports: Math.round(
              data.total_vr_bet_result_today ?? 0
            ).toLocaleString(),
            btiIng: Math.round(data.total_expected_sports_win_amount_bti ?? 0).toLocaleString() + i18next.t("header.overseasParen"),
          },
          {

            label: i18next.t("topNavi.tn020"),
            // total: totalBetProfit,
            total: Math.round(data.total_bet_winlose_today ?? 0).toLocaleString(),
            evo: Math.round(data.total_live_bet_winlose_today ?? 0).toLocaleString(),
            pp: Math.round(data.total_slot_bet_winlose_today ?? 0).toLocaleString(),
            // mini: Math.round(data.total_minigame_bet_winlose_today ?? 0).toLocaleString(),
            mini: Math.round(data.total_token_winlose_today ?? 0).toLocaleString(),
            btiFinal: Math.round(data.total_sports_bet_winlose_today ?? 0).toLocaleString(), // Overseas
            sportsDomestic: Math.round(data.total_sports_domestic_winlose_today ?? 0).toLocaleString(), // Domestic
            // esports: Math.round(
            //   data.total_esports_bet_winlose_today ?? 0
            // ).toLocaleString(),
            esports: Math.round(
              data.total_vr_winlose_today ?? 0
            ).toLocaleString(),
            btiIng: Math.round(data.total_sports_domestic_waiting ?? 0).toLocaleString() + i18next.t("header.domesticParen"), // Domestic Waiting Winlose,
            links: { 
              evo: "live",
              pp: "slot",
              mini: "token",
              btiFinal: "bti",
              sportsDomestic: "ksports",
              esports: "esports",
            },
          },
          {
            label: i18next.t("topNavi.tn021"),
            total: Math.round((data.total_bet_monthly ?? 0) / 1000).toLocaleString() + 'K',
            evo: Math.round((data.total_live_bet_monthly ?? 0) / 1000).toLocaleString() + 'K',
            pp: Math.round((data.total_slot_bet_monthly ?? 0) / 1000).toLocaleString() + 'K',
            // mini: Math.round((data.total_minigame_bet_monthly ?? 0) / 1000).toLocaleString() + 'K',
            mini: Math.round((data.total_token_bet_monthly ?? 0) / 1000).toLocaleString() + 'K',
            btiFinal: Math.round((data.total_sports_bet_monthly ?? 0) / 1000).toLocaleString() + 'K', // Overseas
            sportsDomestic: Math.round((data.total_sports_domestic_bet_monthly ?? 0) / 1000).toLocaleString() + 'K', // Domestic
            // esports:
            //   Math.round(
            //     (data.total_esports_bet_monthly ?? 0) / 1000
            //   ).toLocaleString() + "K",
            esports:
              Math.round(
                (data.total_vr_bet_monthly ?? 0) / 1000
              ).toLocaleString() + "K",
            btiIng: Math.round(data.total_sports_domestic_waiting_expected_amount ?? 0).toLocaleString() + i18next.t("header.domesticParen"), // Domestic Waiting expected win amount,
          },
          {
            label: i18next.t("topNavi.tn022"),
            total: Math.round((data.total_bet_winlose_monthly ?? 0) / 1000).toLocaleString() + 'K',
            evo: Math.round((data.total_live_bet_winlose_monthly ?? 0) / 1000).toLocaleString() + 'K',
            pp: Math.round((data.total_slot_bet_winlose_monthly ?? 0) / 1000).toLocaleString() + 'K',
            // mini: Math.round((data.total_minigame_bet_winlose_monthly ?? 0) / 1000).toLocaleString() + 'K',
            mini: Math.round((data.total_token_winlose_monthly ?? 0) / 1000).toLocaleString() + 'K',
            btiFinal: Math.round((data.total_sports_bet_winlose_monthly ?? 0) / 1000).toLocaleString() + 'K', // Overseas
            sportsDomestic: Math.round((data.total_sports_domestic_winlose_monthly ?? 0) / 1000).toLocaleString() + 'K', // Domestic
            // esports: Math.round(
            //   (data.total_esports_bet_winlose_monthly ?? 0) / 1000
            // ).toLocaleString() + "K",
            esports: Math.round(
              (data.total_vr_winlose_monthly ?? 0) / 1000
            ).toLocaleString() + "K",
            btiIng: 0,
            totalPercentage: calculatePercentage(data.winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            live: calculatePercentage(data.total_live_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            slot: calculatePercentage(data.total_slot_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            // minigame: calculatePercentage(data.total_minigame_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            minigame: calculatePercentage(data.total_token_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            sports: calculatePercentage(data.total_sports_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            sportsDomesticPercentage: calculatePercentage(data.total_sports_domestic_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            // esportsPercentage: calculatePercentage(
            //   data.total_esports_bet_winlose_monthly ?? 0,
            //   data.total_bet_winlose_monthly ?? 0
            // ),
            esportsPercentage: calculatePercentage(
              data.total_vr_winlose_monthly ?? 0,
              data.total_bet_winlose_monthly ?? 0
            ),
            percentage: true
          },
          {
            label: i18next.t("header.betPayoutRate"),
            total: (((data.total_bet_winlose_monthly || 0) / (data.total_bet_monthly || 0)) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%",
            evo: ((data.total_live_bet_winlose_monthly || 0) / (data.total_live_bet_monthly || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
            pp: ((data.total_slot_bet_winlose_monthly || 0) / (data.total_slot_bet_monthly || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
            // mini: ((data.total_minigame_bet_winlose_monthly || 0) / (data.total_minigame_bet_monthly || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
            mini: ((data.total_token_winlose_monthly || 0) / (data.total_token_bet_monthly || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
            btiFinal: ((data.total_sports_bet_winlose_monthly || 0) / (data.total_sports_bet_monthly || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%', // Overseas
            sportsDomestic: ((data.total_sports_domestic_winlose_monthly || 0) / (data.total_sports_domestic_bet_monthly || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%', // Domestic
            // esports: ((data.total_esports_bet_winlose_monthly || 0) / (data.total_esports_bet_monthly || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%', // Esports
            esports: ((data.total_vr_winlose_monthly || 0) / (data.total_vr_bet_monthly || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%', // vr
            lmTotal: (((data.last_month_total_bet_winlose || 0) / (data.last_month_total_bet || 0)) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%",
            lmEvo: ((data.last_month_total_live_bet_winlose || 0) / (data.last_month_total_live_bet || 0) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%',
            lmPp: ((data.last_month_total_slot_bet_winlose || 0) / (data.last_month_total_slot_bet || 0) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%',
            lmMini: ((data.last_month_total_token_winlose || 0) / (data.last_month_total_token_bet || 0) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
            // lmEsports: ((data.last_month_total_esports_bet_winlose || 0) / (data.last_month_total_esports_bet || 0) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%', // Esports
            lmEsports: ((data.last_month_total_vr_winlose || 0) / (data.last_month_total_vr_bet || 0) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%', // Esports
            lmBtiFinal: ((data.last_month_total_sports_bet_winlose || 0) / (data.last_month_total_sports_bet || 0) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%', // Overseas
            lmSportsDomestic: ((data.last_month_total_sports_domestic_winlose || 0) / (data.last_month_total_sports_domestic_bet || 0) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%', // Domestic
            btiIng: 0,
            // live: calculatePercentage(data.total_live_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            // slot: calculatePercentage(data.total_slot_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            // minigame: calculatePercentage(data.total_minigame_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            // sports: calculatePercentage(data.total_sports_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            // sportsDomesticPercentage: calculatePercentage(data.total_sports_domestic_bet_winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0),
            // percentage: true
          },
        ]}
        style={headerListStyle(400)}
        renderItem={(item, index) => (
          <li style={headerListItemStyle} key={index}>
            <Typography.Text
              strong
              style={headerListTitleStyle(110)}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {/* {t(`topNavi.tn${String(index + 18).padStart(3, "0")}`)} */}
              {item.label}
            </Typography.Text>

            <Typography.Text style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}>
              {item.total ?? 0}
              <LastMonthRate value={item.lmTotal} />
              {/* {item.percentage && (<PercentageColored enclosed onlyNumber value={item.totalPercentage} />)} */}
            </Typography.Text>

            <Typography.Text style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}>
              <a href={statisticUrl(item.links?.evo)} style={LINK_RESET}>
                {item.evo ?? 0}
                <LastMonthRate value={item.lmEvo} />
                {item.percentage && (<PercentageColored enclosed onlyNumber value={item.live} />)}
              </a>
            </Typography.Text>
            <Typography.Text style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}>
              <a href={statisticUrl(item.links?.pp)} style={LINK_RESET}>
                {item.pp ?? 0}
                <LastMonthRate value={item.lmPp} />
                {item.percentage && (<PercentageColored enclosed onlyNumber value={item.slot} />)}
              </a>
            </Typography.Text>
            <Typography.Text style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}>
              <a href={statisticUrl(item.links?.mini)} style={LINK_RESET}>
                {item.mini ?? 0}
                <LastMonthRate value={item.lmMini} />
                {item.percentage && (<PercentageColored enclosed onlyNumber value={item.minigame} />)}
              </a>
            </Typography.Text>
            <Typography.Text style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}>
              <a href={statisticUrl(item.links?.esports)} style={LINK_RESET}>
                {item.esports ?? 0}
                <LastMonthRate value={item.lmEsports} />
                {item.percentage && (<PercentageColored enclosed onlyNumber value={item.esportsPercentage} />)}
              </a>
            </Typography.Text>
            <Typography.Text style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}>
              <a href={statisticUrl(item.links?.btiFinal)} style={LINK_RESET}>
                {item.btiFinal ?? 0}
                <LastMonthRate value={item.lmBtiFinal} />
                {item.percentage && (<PercentageColored enclosed onlyNumber value={item.sports} />)}
              </a>
            </Typography.Text>
            <Typography.Text style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}>
              <a href={statisticUrl(item.links?.sportsDomestic)} style={LINK_RESET}>
                {item.sportsDomestic ?? 0}
                <LastMonthRate value={item.lmSportsDomestic} />
                {item.percentage && (<PercentageColored enclosed onlyNumber value={item.sportsDomesticPercentage} />)}
              </a>
            </Typography.Text>
            
            <Typography.Text style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}>
              {item.btiIng === 0 ? '' : item.btiIng}
            </Typography.Text>
          </li>
        )}
      />
    </div>
  );
};

export default HeaderItem4;
