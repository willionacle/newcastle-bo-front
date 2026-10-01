import i18next from "@/i18n/i18n";
import { RecentTrans } from "@/api/cs-statics/totalStatics";
import {
  headerListHeaderItemStyle,
  headerListHeaderStyle,
  headerListItemStyle,
  headerListStyle,
} from "./HeaderStyle";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import commaNumber from "comma-number";

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

const HeaderItem3a = ({ data, loading }: Props) => {

  const items: Item[] = data
  ? [
      ...(data.deposits ?? []).map(item => ({
        userId: item?.user_id,
        name: item?.user_real_name || item.username,
        amount: item?.amount,
      })),
      ...(data.withdrawals ?? []).map(item => ({
        userId: item?.user_id,
        name: item?.user_real_name || item.username,
        amount: item?.amount,
        isWithdraw: true,
      })),
    ]
  : [];

  console.log("recentt rans", data, items)

  return (
    <div style={{ flex: "auto" }}>
      <ul style={headerListHeaderStyle}>
        {/* <li style={headerListHeaderItemStyle(1)}>이름</li> */}
        <li style={headerListHeaderItemStyle(1)}>{i18next.t("header.todayRanking")}</li>
      </ul>
      <List
        loading={loading}
        dataSource={items}
        style={headerListStyle(160)}
        renderItem={(item: Item) => (
          <li style={headerListItemStyle}>
            <Typography.Text
              style={{ ...headerListHeaderItemStyle(1) }}
            >
              <Link to={`/user/${item.userId}?tab=dailystats`} style={{textDecoration: "underline", color: "unset"}}>{item.name}</Link>
            </Typography.Text>
            <Typography.Text style={headerListHeaderItemStyle(1)}>
              {item.isWithdraw ? (
                <span style={{color: "red"}}>({commaNumber(Math.abs(item.amount))})</span>
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

export default HeaderItem3a;
