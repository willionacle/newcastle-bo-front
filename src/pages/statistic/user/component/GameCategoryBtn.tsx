import i18next from "@/i18n/i18n";
import { KeyedMutator } from "swr";
import { SWRType } from "@/api/types";
import { Button, Divider, Space } from "antd";
import { CSSProperties, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { parse } from "qs";
import useCategoryVisibility from "@/hooks/useCategoryVisibility";

interface Props {
  mutate?: KeyedMutator<SWRType<any>>;
  setFilters: any;
  loading?: boolean;
  hideAll?: boolean;
}

interface GameCatButtonProps {
  label: string;
  value: string;
}

// Values must match the backend's game_category enum exactly: all, slot,
// minigame, live, special, itf_parlay, itf_intl_parlay, itf_special_parlay.
const GameCatBtnData: GameCatButtonProps[] = [
  {
    label: i18next.t("col.all"),
    value: "",
  },
  {
    label: i18next.t("memberDetail.mis132"),
    value: "slot",
  },
  {
    label: i18next.t("gameCat.minigame"),
    value: "minigame",
  },
  {
    label: i18next.t("title.live"),
    value: "live",
  },
  {
    label: i18next.t("gameCat.special"),
    value: "special",
  },
  {
    label: i18next.t("sportCat.domesticSports"),
    value: "itf_parlay",
  },
  {
    label: i18next.t("sportCat.internationalSports"),
    value: "itf_intl_parlay",
  },
  {
    label: i18next.t("sportCat.specialSports"),
    value: "itf_special_parlay",
  },
];

const btnCSS: CSSProperties = {
  background: "var(--ant-button-default-active-bg)",
  color: "var(--ant-color-primary)",
  borderColor: "var(--ant-color-primary)",
  borderRadius: 6,
  fontWeight: 700,
};

const btnCSSActive: CSSProperties = {
  // background: 'unset',
  color: "var(--ant-button-default-color)",
  borderColor: "var(--ant-color-primary)",
  borderRadius: 6,
  fontWeight: 700,
};

const GameCategoryButtonFilter = ({ setFilters, loading, hideAll }: Props) => {
  const [searchParam, setSearchParams] = useSearchParams();
  const { search } = useLocation();
  // Every tab follows its own product switch — see useCategoryVisibility.
  const isCategoryVisible = useCategoryVisibility();

  const handleGameCatBtn = (value: GameCatButtonProps["value"]) => {
    if (loading) return;
    const query = parse(search.replace("?", ""));
    const columnby = value === "live" ? "dw_sum" : "roll_90"
    setSearchParams({ ...query, game_category: value, columnby });
    setFilters((prevData: any) => ({
      ...prevData,
      columnby,
      game_category: value || null,
    }));
    // mutate();
  };

  const buttonItems = (hideAll ? GameCatBtnData.filter((item) => item.value !== "") : GameCatBtnData).filter((item) =>
    isCategoryVisible(item.value)
  );

  useEffect(() => {
    const query = parse(search.replace("?", ""));
    setSearchParams({
      ...query,
      game_category: (query.game_category as string) || "",
    });
    setFilters((prevData: any) => ({
      ...prevData,
      game_category: (query.game_category as string) || "",
    }));
  }, []);

  return (
    <>
      <Space>
        {buttonItems.map((item, index) => (
          <Button
            key={index}
            style={
              searchParam.get("game_category") === item.value
                ? btnCSSActive
                : btnCSS
            }
            onClick={() => handleGameCatBtn(item.value)}
            loading={loading && searchParam.get("game_category") === item.value}
          >
            {item.label}
          </Button>
        ))}
      </Space>
      <Divider />
    </>
  );
};

export default GameCategoryButtonFilter;
