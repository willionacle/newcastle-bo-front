import { StatsDataType } from "@/api/cs-statics/totalStatics";
import {
  headerListHeaderItemStyle,
  headerListHeaderStyle,
  headerListItemStyle,
  headerListStyle,
  headerListTitleStyle,
} from "./HeaderStyle";
import { List, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { stringify } from "qs";
import NavClickable from "@/components/NavClickable";

interface Props {
  data: StatsDataType | null;
  loading: boolean;
  stopSound: () => void;
}

const HeaderItem3 = ({ data, loading, stopSound }: Props) => {
  const { t } = useTranslation();

  // console.log(
  //   data
  //     ? [
  //         {
  //           ...data.depositCounts,
  //           link: "/payment",
  //         },
  //         {
  //           ...data.withdrawalCounts,
  //           link: "/payment/withdraw",
  //         },
  //         {
  //           label: "UNVERIFIED",
  //           count: data.userCounts,
  //           link: "/user",
  //         },
  //       ]
  //     : []
  // );

  return (
    <div style={{ flex: "auto" }}>
      <ul style={headerListHeaderStyle}>
        <li style={headerListTitleStyle()}></li>
        <li style={headerListHeaderItemStyle(1)}>{t("topNavi.tn011")}</li>
        {/* <li style={headerListHeaderItemStyle(1)}>{t("topNavi.tn012")}</li> */}
        <li style={headerListHeaderItemStyle(1)}>{t("topNavi.tn013")}</li>
      </ul>

      <List
        loading={loading}
        dataSource={
          data
            ? [
                {
                  "Waiting": Math.round(data.deposit_waiting ?? 0).toLocaleString(),
                  "Cancelled": Math.round(data.deposit_cancelled ?? 0).toLocaleString(),
                  "Completed": Math.round(data.deposit_completed ?? 0).toLocaleString(),
                  "Applied": Math.round(data.deposit_applied ?? 0).toLocaleString(),
                  link: "/payment",
                  title: t(`topNavi.tn015`)
                },
                {
                  "Waiting": Math.round(data.withdraw_waiting ?? 0).toLocaleString(),
                  "Cancelled": Math.round(data.withdraw_cancelled ?? 0).toLocaleString(),
                  "Completed": Math.round(data.withdraw_completed ?? 0).toLocaleString(),
                  "Applied": Math.round(data.withdraw_applied ?? 0).toLocaleString(),
                  link: "/payment/withdraw",
                  title: t(`topNavi.tn016`)
                },
                {
                  "Applied": Math.round(data.user_unverified ?? 0).toLocaleString(),
                  "Waiting": 0,
                  "Completed": Math.round(data.user_active ?? 0).toLocaleString(),
                  link: "/user",
                  title: t(`topNavi.tn017`)
                },
                {
                  "Applied": Math.round(data.coupon_applied ?? 0).toLocaleString(),
                  "Waiting": Math.round(data.coupon_waiting ?? 0).toLocaleString(),
                  "Completed": Math.round(data.coupon_completed ?? 0).toLocaleString(),
                  link: `/promotion/coupon-application?${stringify({
                    status: {label: 'Applied', value: 0, key: 0}
                  })}`,
                  title: t(`topNavi.tn030`)
                },
                {
                  "Applied": Math.round(data.high_value_user ?? 0).toLocaleString(),
                  "Waiting": '',
                  "Completed": '',
                  // link: `/user/highvalue?provider_id=evo&columnby=evo_balance&orderby=desc&is_online=1`,
                  link: `/user/highvalue?high_value=1&columnby=balance&orderby=desc`,
                  title: t(`topNavi.tn032`)
                },
                // {
                //   "Applied": 0,
                //   "Waiting": '',
                //   "Completed": 0,
                //   title: "미션"
                // },
              ]
            : []
        }
        style={headerListStyle(160)}
        renderItem={(value: any) => (
          <li style={headerListItemStyle}>
            <Typography.Text strong style={headerListTitleStyle()}>
              <NavClickable to={value.link} onBeforeNavigate={stopSound}>
                {/* {t(`topNavi.tn${String(index + 15).padStart(3, "0")}`)} */}
                {value.title}
              </NavClickable>
            </Typography.Text>
            <>
              <Typography.Text
                style={{ ...headerListHeaderItemStyle(1), color: "red" }}
                onClick={() => {
                  stopSound();
                }}
              >
                {
                  value?.Applied
                }
              </Typography.Text>
              {/* <Typography.Text style={headerListHeaderItemStyle(1)}>
                {
                  value?.Waiting
                }
              </Typography.Text> */}
              <Typography.Text style={headerListHeaderItemStyle(1)}>
                {
                  value?.Completed
                }
              </Typography.Text>
            </>
          </li>
        )}
      />
    </div>
  );
};

export default HeaderItem3;
