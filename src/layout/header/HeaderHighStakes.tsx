import { List, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { headerListItemStyle, headerListStyle } from "./HeaderStyle";
import NavClickable from "@/components/NavClickable";

interface Props {
  count: number;
  onClick: () => void;
}

// 고액배팅 header counter (client request 20) -- open (expanded) view. See
// the collapsed-row entry in Header.tsx for the counterpart the operator's
// screenshot actually points at; this mirrors it for the expanded layout.
// Deliberately its own small component rather than folded into HeaderItem3's
// list -- that one renders three sub-columns (Waiting/Completed/Applied)
// this feature doesn't have.
const HeaderHighStakes = ({ count, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <List
      dataSource={[{ title: t("topNavi.highStakes"), value: count.toLocaleString() }]}
      style={{ ...headerListStyle(150), flex: "auto" }}
      renderItem={(item) => (
        <li>
          <NavClickable
            to="/promotion/high-stakes?tab=history"
            onBeforeNavigate={onClick}
            style={{ ...headerListItemStyle, ...(count > 0 ? { color: "red" } : {}) }}
          >
            <Typography.Text strong>{item.title}</Typography.Text>
            <Typography.Text>{item.value}</Typography.Text>
          </NavClickable>
        </li>
      )}
    />
  );
};

export default HeaderHighStakes;
