import { StatsDataType } from "@/api/cs-statics/totalStatics";
import i18next from "@/i18n/i18n";
import {
  headerListHeaderItemStyle,
  headerListHeaderStyle,
  headerListItemStyle,
  headerListStyle,
  headerListTitleStyle,
  percentageWrapper,
} from "./HeaderStyle";
import { List, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { computeAverageRollingPercentage } from "./HeaderItem1";
import { calculatePercentage } from "./HeaderItem4";

interface Props {
  loading: boolean;
  data: StatsDataType | null;
}

const HeaderItem5 = ({ loading, data }: Props) => {
  const { t } = useTranslation();

  // const dailyData = data
  //   ? [
  //       data.total_deposit_today ?? 0,
  //       data.total_withdraw_today ?? 0,
  //       data.winlose_today,
  //       data.total_bonus_today ?? 0,
  //       data.rolling_today ?? 0,
  //     ]
  //   : [];

  // const monthlyData = data
  //   ? [
  //       data.total_deposit_monthly ?? 0,
  //       data.total_withdraw_monthly ?? 0,
  //       data.winlose_monthly,
  //       data.total_bonus_monthly ?? 0,
  //       data.rolling_monthly ?? 0,
  //     ]
  //   : [];
  const dailyData = data
    ? [
        { title: t(`topNavi.tn023`), amount: data.total_deposit_today ?? 0 },
        { title: t(`topNavi.tn024`), amount: data.total_withdraw_today ?? 0 },
        { title: t(`topNavi.tn025`), amount: data.winlose_today },
        {
          title: t(`topNavi.tn034`),
          amount:
            (data.total_bonus_today ?? 0) + (data.total_coupon_today ?? 0) + (data.total_lucky_coupon_today ?? 0),
        },
        { title: t(`topNavi.tn027`), amount: data.rolling_today ?? 0 },
        {
          title: i18next.t("title.activeUsers"),
          amount: [
            data.today_users,
            data.today_betting_users,
            data.today_deposit_users,
          ],
        },
      ]
    : [];

  const monthlyData = data
    ? [
        { title: t(`topNavi.tn023`), amount: data.total_deposit_monthly ?? 0 },
        { title: t(`topNavi.tn024`), amount: data.total_withdraw_monthly ?? 0 },
        { 
          title: t(`topNavi.tn025`), 
          amount: data.winlose_monthly,
          additional: (calculatePercentage(data.winlose_monthly ?? 0, data.total_bet_winlose_monthly ?? 0))?.toFixed(0) + "%"
        },
        {
          title: t(`topNavi.tn034`),
          amount:
            (data.total_bonus_monthly ?? 0) + (data.total_coupon_monthly ?? 0) + (data.total_lucky_coupon_monthly ?? 0),
          additional:
            ((data.bonus_ratio ?? 0) * 100).toLocaleString(undefined, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }) + "%",
        },
        {
          title: t(`topNavi.tn027`),
          amount: data.rolling_monthly ?? 0,
          additional: computeAverageRollingPercentage(data),
        },
        {
          title: "",
          amount: [
            data.monthly_users,
            data.monthly_betting_users,
            data.monthly_deposit_users,
          ],
          style:{color: "#4f46e5",fontWeight:"700"}
        },
      ]
    : [];

  return (
    <div style={{ flex: "auto" }}>
      <ul style={headerListHeaderStyle}>
        <li style={headerListTitleStyle()}></li>
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("dailyStatistics.ds018")}</li>
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("header.thisMonth")}</li>
      </ul>

      <List
        size="small"
        loading={loading}
        dataSource={dailyData}
        style={headerListStyle(160)}
        renderItem={(item, index) => (
          <li style={headerListItemStyle} key={index}>
            <Typography.Text
              strong
              style={{
                ...headerListTitleStyle(),
                justifyContent: "flex-start",
              }}
            >
              {item.title}
            </Typography.Text>
            <Typography.Text
              style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}
            >
              {Array.isArray(item.amount)
                ? item.amount.map((amt:number, idx:number) => (
                    <span key={idx}>
                      {amt.toLocaleString()}
                      {idx < (item.amount as number[]).length - 1 && "/"}
                    </span>
                  ))
                : item.amount?.toLocaleString()}
            </Typography.Text>

            <Typography.Text
              style={{ ...headerListHeaderItemStyle(1), ...percentageWrapper }}
            >
              {Array.isArray(monthlyData[index].amount)
                ? (monthlyData[index].amount as number[]).map((amt:number, idx:number) => (
                    <span key={idx} style={monthlyData[index].style}>
                      {amt}
                      {idx <
                        (monthlyData[index].amount as number[]).length - 1 &&
                        "/"}
                    </span>
                  ))
                : monthlyData[index].amount?.toLocaleString()}
              {monthlyData[index].additional ? (
                <span style={{ fontSize: "11px" }}>
                  ({monthlyData[index].additional})
                </span>
              ) : (
                ""
              )}
            </Typography.Text>
          </li>
        )}
      />
    </div>
  );
};

export default HeaderItem5;
