import i18next from "@/i18n/i18n";
import { RecentTrans } from "@/api/cs-statics/totalStatics";
import {
  headerListHeaderItemStyle,
  headerListHeaderStyle,
  headerListItemStyle,
  headerListStyle,
} from "./HeaderStyle";
import { List, Typography } from "antd";
import { useLocation } from "react-router-dom";
import commaNumber from "comma-number";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import NavClickable from "@/components/NavClickable";

interface Props {
  data?: RecentTrans;
  loading: boolean;
}

interface Item {
  userId: number;
  name: string;
  amount: number;
  isWithdraw?: boolean;
}

export interface QueryData {
  dateRange: string[] | undefined;
  game_id: string | undefined;
  game_category?: string;
}

const HeaderItem3b = ({ data, loading }: Props) => {
  const { search } = useLocation();
  const items: Item[] = data
    ? [
        ...(data.tops ?? []).map((item) => ({
          userId: item?.user_id,
          name: item?.user_real_name || item.username,
          amount: item?.amount,
        })),
        ...(data.belows ?? []).map((item) => ({
          userId: item?.user_id,
          name: item?.user_real_name || item.username,
          amount: item?.amount,
          isWithdraw: true,
        })),
      ]
    : [];

  const linkTo = (item: Item) => {
    const start = dayjs().startOf("month").tz().format();
    const end = dayjs().endOf("month").tz().format();

    const query = parse(search.replace("?", "")) as unknown as QueryData;
    return {
      pathname: `user/${item.userId}`,
      search: stringify({
        ...query,
        tab: "dailystats",
        game_id: null,
        dateRange: [start, end],
        page: 1,
      }),
    };
  };

  console.log("recentt rans", data, items);

  return (
    <div style={{ flex: "auto" }}>
      <ul style={headerListHeaderStyle}>
        {/* <li style={headerListHeaderItemStyle(1)}>이름</li> */}
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("header.thisMonthRanking")}</li>
      </ul>
      <List
        loading={loading}
        dataSource={items}
        style={headerListStyle(160)}
        renderItem={(item: Item) => (
          <li style={headerListItemStyle}>
            <Typography.Text style={{ ...headerListHeaderItemStyle(1) }}>
              <NavClickable
                to={linkTo(item)}
                style={{ textDecoration: "underline", color: "unset" }}
              >
                {item.name}
              </NavClickable>
            </Typography.Text>
            <Typography.Text style={headerListHeaderItemStyle(1)}>
              {item.isWithdraw ? (
                <span style={{ color: "red" }}>
                  ({commaNumber(Math.abs(item.amount))})
                </span>
              ) : (
                <span>{commaNumber(item.amount)}</span>
              )}
            </Typography.Text>
          </li>
        )}
      />
    </div>
  );
};

export default HeaderItem3b;
