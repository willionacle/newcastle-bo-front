import { List, Typography } from "antd";
import { headerListItemStyle, headerListStyle } from "./HeaderStyle";
import { useTranslation } from "react-i18next";
import { StatsDataType } from "@/api/cs-statics/totalStatics";
import NavClickable from "@/components/NavClickable";

interface Props {
  data: StatsDataType | null;
  loading: boolean;
}

export function computeAverageRollingPercentage(data: StatsDataType | null) {
  if (!data) return "-";
  const {
    total_live_bet_monthly = 0,
    total_slot_bet_monthly = 0,
    total_sports_bet_monthly = 0,
    total_sports_domestic_bet_monthly = 0,
    rolling_monthly = 0,
  } = data ?? {};

  const gameMonthlySum = (total_live_bet_monthly || 0) +
  (total_slot_bet_monthly || 0) +
  (total_sports_bet_monthly || 0) +
  (total_sports_domestic_bet_monthly || 0);

  const averagePercentage = ((rolling_monthly || 0) / gameMonthlySum) * 100;
  
  console.log("rolling_monthly", rolling_monthly);
  console.log("gameMonthlySum", gameMonthlySum);
  console.log("averagePercentage", averagePercentage);

  return `${(averagePercentage).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%`
}

const HeaderItem1 = ({ data, loading }: Props) => {
  const { t } = useTranslation();
  const {
    // total_midnight_holding = 0,
    total_holding = 0,
    // total_rolling = 0,
    // monthly_users = 0,
    total_users = 0,
    online_users = 0,
    // bonus_ratio = 0,
    // today_users = 0,
    // high_value_user = 0,
  } = data ?? {};

  const listData1 = [
    // { title: t('topNavi.tn000'), value: Math.round(total_midnight_holding ?? 0).toLocaleString()}, 
    { title: t('topNavi.tn001'), value: Math.round(total_holding ?? 0).toLocaleString()}, 
    // { title: t('topNavi.tn002'), value: Math.round(total_rolling ?? 0).toLocaleString()}, 
    { title: t('topNavi.tn003'), value: Math.round(total_users ?? 0).toLocaleString()}, 
    { title: t('topNavi.tn004'), value: Math.round(online_users ?? 0).toLocaleString(), link: '/user?is_online=1'}, 
    // { title: t('topNavi.tn032'), value: Math.round(high_value_user ?? 0).toLocaleString(), link: '/user?provider_id=evo&columnby=evo_balance&orderby=desc'}, 
    // { title: "오늘이용유저", value: Math.round(today_users ?? 0).toLocaleString()}, 
    // { title: "당월이용유저", value: Math.round(monthly_users ?? 0).toLocaleString()}, 
    // { title: t('topNavi.tn029'), value: (((bonus_ratio ?? 0) * 100)).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})+'%'},
    // { title: t('평균롤링%'), value: computeAverageRollingPercentage(data)},
  ];

  return (
    <List
      loading={loading}
      dataSource={listData1}
      style={{ ...headerListStyle(150), flex: "auto" }}
      renderItem={(item) => {
        // if (index === 6) return;

        const content = (
          <>
            <Typography.Text strong>
              {
                /* {t(`topNavi.tn${String(index).padStart(3, "0")}`)} */
                item.title
              }
            </Typography.Text>
            <Typography.Text>
              {item.value}
            </Typography.Text>
          </>
        );

        return item.link ? (
          <li>
            <NavClickable to={item.link} style={headerListItemStyle}>
              {content}
            </NavClickable>
          </li>
        ) : (
          <li style={headerListItemStyle}>{content}</li>
        );
      }}
    />
  );
};

export default HeaderItem1;
