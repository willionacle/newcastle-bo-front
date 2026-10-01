import i18next from "@/i18n/i18n";
import { ResUser, SWRType } from "@/api/types";
import { Button, Space } from "antd";
import React, { CSSProperties, useState } from "react";
import dayjs from "dayjs";
import { KeyedMutator } from "swr";

interface Props {
  mutate?: KeyedMutator<SWRType<any>>;
  setFilters: any;
  loading?: boolean;
  hideAll?: boolean;
  user?: ResUser['data'];
}

export interface GameCatButtonProps {
  label: string;
  value: string;
}

const GameCatBtnData: GameCatButtonProps[] = [
  { label: i18next.t("col.all"), value: "" },
  { label: i18next.t("gameCat.liveCasino"), value: "live" },
  { label: i18next.t("memberDetail.mis133"), value: "sports" },
  { label: i18next.t("memberDetail.mis132"), value: "slot" },
  { label: i18next.t("memberDetail.mis134"), value: "minigame" },
  { label: i18next.t("gameCat.fishing"), value: "fish" },
  // { label: "카드 게임", value: "card" },
];

const btnCSS: CSSProperties = {
  background: "var(--ant-button-default-active-bg)",
  color: "var(--ant-color-primary)",
  borderColor: "var(--ant-color-primary)",
  borderRadius: 6,
  fontWeight: 700,
};

const btnCSSActive: CSSProperties = {
  color: "var(--ant-button-default-color)",
  borderColor: "var(--ant-color-primary)",
  borderRadius: 6,
  fontWeight: 700,
};

const CategoryFilter = ({ setFilters, loading, hideAll, user }: Props) => {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeGameId, setActiveGameId] = useState<string>("");

  const handleGameCatBtn = (value: GameCatButtonProps["value"]) => {
    if (loading) return;

    const isReset = activeCategory === value;
    const newValue = isReset ? "" : value;

    setActiveCategory(newValue);
    setActiveGameId(""); 

    setFilters((prevData: any) => ({
      ...prevData,
      game_category: newValue || null,
      game_id: null,
    }));
  };

  const handleSportsHistory = () => {
    const specialId = "custom_sportshistory";
    
    setActiveCategory(specialId);
    setActiveGameId(specialId);

    setFilters((prevData: any) => ({
      ...prevData,
      tab: "bettingLog",
      game_id: specialId,
      game_category: specialId,
      start_date: dayjs().tz().startOf('day').format(),
      end_date: dayjs().tz().endOf('day').format(),
      username: user?.username,
      status: "1",
    }));
  };

  const buttonItems = hideAll
    ? GameCatBtnData.filter((item) => item.value !== "")
    : GameCatBtnData;

  return (
    <Space direction="vertical" style={{ width: '100%', marginTop: '16px' }}>
      <Space wrap>
        {buttonItems.map((item, index) => (
          <React.Fragment key={index}>
            <Button
              key={index}
              style={activeCategory === item.value ? btnCSSActive : btnCSS}
              onClick={() => handleGameCatBtn(item.value)}
              loading={loading && activeCategory === item.value}
            >
              {item.label}
            </Button>
            {item.value === "sports" && user?.username && (
              <Button
                style={activeGameId === "custom_sportshistory" ? btnCSSActive : btnCSS}
                onClick={handleSportsHistory}
              >
                국내형스포츠
              </Button>
            )}
          </React.Fragment>
        ))}
      </Space>
    </Space>
  );
};

export default CategoryFilter;