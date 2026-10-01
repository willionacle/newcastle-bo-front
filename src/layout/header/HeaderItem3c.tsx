import i18next from "@/i18n/i18n";
import { RecentTrans, TopUser } from "@/api/cs-statics/totalStatics";
import {
  headerListHeaderItemStyle,
  headerListHeaderStyle,
  headerListItemStyle,
  headerListStyle,
} from "./HeaderStyle";
import { Badge, List, Tooltip, Typography } from "antd";
import commaNumber from "comma-number";
import NavClickable from "@/components/NavClickable";
// import dayjs from "dayjs";
// import { parse, stringify } from "qs";

interface Props {
  data?: RecentTrans;
  loading: boolean;
  total:number | undefined;
}

export interface QueryData {
  dateRange: string[] | undefined;
  game_id: string | undefined;
  game_category?: string;
}

const HeaderItem3c = ({ data, loading,total }: Props) => {
  // const { search } = useLocation();
  // const items: Item[] = data
  //   ? [
  //       ...(data.tops ?? []).map((item) => ({
  //         userId: item?.user_id,
  //         name: item?.user_real_name || item.username,
  //         amount: item?.amount,
  //       })),
  //       ...(data.belows ?? []).map((item) => ({
  //         userId: item?.user_id,
  //         name: item?.user_real_name || item.username,
  //         amount: item?.amount,
  //         isWithdraw: true,
  //       })),
  //     ]
  //   : [];

  const linkTo = (item: TopUser) => ({
    pathname: `user/${item.user_id}`,
    // search: stringify({
    //   ...query,
    //   tab: "dailystats",
    //   game_id: null,
    //   dateRange: [start, end],
    //   page: 1,
    // }),
  });

  // const totalAmount = balanceRankingData.reduce(
  //   (acc, cur) => acc + cur.amount,
  //   0,
  // );

  // console.log("recentt rans", data, items);

  return (
    <div style={{ flex: "auto" }}>
      <ul style={headerListHeaderStyle}>
        {/* <li style={headerListHeaderItemStyle(1)}>이름</li> */}
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("header.balanceRanking")}</li>
      </ul>
      <List
        loading={loading}
        dataSource={[
          {
            user_id:undefined,
            user_real_name: i18next.t("topNavi.tn001"),
            balance:commaNumber(total ?? 0),
            is_total: true,
            is_online: undefined,
          },
          ...data?.topusers ?? [],
        ]}
        style={headerListStyle(160)}
        renderItem={(item) => (
          <li style={headerListItemStyle}>
            <Typography.Text
              style={{
                ...headerListHeaderItemStyle(1),
                textAlign: "left",
                paddingLeft: "5px",
              }}
            >
              {item.is_online !== undefined ? (
                <Tooltip title={item.is_online ? i18next.t("status.online") : i18next.t("status.offline")}>
                  <Badge color={item.is_online ? "#52c41a" : "#ff4d4f"} />
                </Tooltip>
              ) : (
                <span>&nbsp;</span>
              )}
              <NavClickable
                to={linkTo(item)}
                style={{
                  textDecoration: item.is_total ? "unset" : "underline",
                  cursor: "pointer",
                  marginLeft: "3px",
                  fontWeight: item.is_total ? "bolder" : "",
                }}
              >
                {item.user_real_name}
              </NavClickable>
            </Typography.Text>

            <Typography.Text style={{ ...headerListHeaderItemStyle(1),fontWeight: item.is_total ? "bolder" : "", }}>
              {commaNumber(item.balance)}
            </Typography.Text>
          </li>
        )}
      />
    </div>
  );
};

export default HeaderItem3c;
