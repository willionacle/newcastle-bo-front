import i18next from "@/i18n/i18n";
import { KeyedMutator } from "swr";
import { SWRType } from "@/api/types";
import { Button, Divider, Space } from "antd";
import { CSSProperties } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { parse } from "qs";
import useCategoryVisibility from "@/hooks/useCategoryVisibility";

interface Props {
  mutate?: KeyedMutator<SWRType<any>>;
  setFilters: any;
  loading?: boolean;
  hideAll?: boolean;
  forMaintenance?: boolean;
  forBettingStats?: boolean;
}

interface GameCatButtonProps {
  label: string;
  value: string;
}

// TEMPORARY: only show live/sports/slot lobby for now — restore the full list below when ready.
const GameCatBtnData: GameCatButtonProps[] = [
  {
    label: i18next.t("memberDetail.mis133"),
    value: 'sports-lobby'
  },
  {
    label: i18next.t("gameCat.domesticSportsLobby"),
    value: 'dsports-lobby'
  },
  {
    label: i18next.t("gameCat.slotLobby"),
    value: 'slot-lobby'
  },
  // {
  //   label: i18next.t("col.all"),
  //   value: ''
  // },
  // {
  //   label: i18next.t("memberDetail.mis132"),
  //   value: 'slot'
  // },
  // {
  //   label: i18next.t("memberDetail.mis134"),
  //   value: 'minigame'
  // },
  {
    label: i18next.t("gameCat.miniLobby"),
    value: "minigame-lobby",
  },
  {
    label: i18next.t("gameCat.liveCasino"),
    value: 'live-lobby'
  },
  // {
  //   label: i18next.t("gameCat.fishingLobby"),
  //   value: 'fish-lobby'
  // },
  // {
  //   label: i18next.t("gameCat.fishing"),
  //   value: 'fish'
  // },
  // {
  //   label: i18next.t("gameCat.casual"),
  //   value: 'casual'
  // },
  // {
  //   label: i18next.t("gameCat.special"),
  //   value: 'special'
  // },
];

const btnCSS: CSSProperties = {
  background: 'var(--ant-button-default-active-bg)',
  color: 'var(--ant-color-primary)',
  borderColor: 'var(--ant-color-primary)',
  borderRadius: 6,
  fontWeight: 700,
}

const btnCSSActive: CSSProperties = {
  // background: 'unset',
  color: 'var(--ant-button-default-color)',
  borderColor: 'var(--ant-color-primary)',
  borderRadius: 6,
  fontWeight: 700,
}


const GameCategoryButtonFilter = ({ setFilters, loading, hideAll, forMaintenance,forBettingStats }: Props) => {
  const [searchParam, setSearchParams]= useSearchParams();
  const { search } = useLocation();
  // Each lobby follows its own product switch — see useCategoryVisibility.
  // The default landing category for 게임 관리 is picked the same way in
  // useMenu.tsx, so the link never lands on a lobby that's been filtered out.
  const isCategoryVisible = useCategoryVisibility();

  const handleGameCatBtn = (value: GameCatButtonProps['value']) => {
    if (loading) return;
    const query = parse(search.replace("?", ""));

    setSearchParams({...query, game_category: value})
    setFilters((prevData: any) => ({
      ...prevData,
      game_category: value ?? null
    }));
    // mutate();
  }

  const excludedValuesForGameMaintenance = ["", "slot", "", "fish", "card","casual","special","dsports-lobby"];
  const excludedValuesForBettingStats = ["casual","special"];

  const buttonItems = (hideAll
  ? GameCatBtnData.filter((item) => item.value !== "")
  : forMaintenance
  ? GameCatBtnData.filter(
      (item) => !excludedValuesForGameMaintenance.includes(item.value)
    )
  : forBettingStats
  ? GameCatBtnData.filter(
      (item) => !excludedValuesForBettingStats.includes(item.value)
    )
  : GameCatBtnData).filter((item) => isCategoryVisible(item.value));

  return (
    <>
      <Space>
        {buttonItems.map((item, index) => (
          <Button 
            key={index} 
            style={searchParam.get('game_category') === item.value ? btnCSSActive : btnCSS} 
            onClick={() => handleGameCatBtn(item.value)} 
            loading={loading && searchParam.get('game_category') === item.value}
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
