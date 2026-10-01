import i18next from "@/i18n/i18n";
import { KeyedMutator } from "swr";
import { ResUser, SWRType } from "@/api/types";
import { Button, Col, Row, Space } from "antd";
import { CSSProperties } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { parse } from "qs";
import { useVendorList } from "@/api/vendor-list/get";
import useCategoryVisibility from "@/hooks/useCategoryVisibility";

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

// Values must match the backend's game_category enum: "", slot, minigame,
// live, special, sports. (Button set otherwise kept in sync with the
// 유저기간별통계 page — see src/pages/statistic/user/component/GameCategoryBtn.tsx —
// but collapsed to a single 스포츠 tab instead of separate domestic/
// international/special sport tabs.)
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
    label: i18next.t("memberDetail.mis133"),
    value: "sports",
  },
];

const btnCSS: CSSProperties = {
  background: "var(--ant-button-default-active-bg)",
  color: "var(--ant-color-primary)",
  borderColor: "var(--ant-color-primary)",
  borderRadius: 6,
  fontWeight: 700,
};
const ProviderBtnCSS = (active: boolean): CSSProperties => ({
//   background: "var(--ant-button-default-active-bg)",
background: 'unset',
  color: "var(--ant-color-primary)",
  borderColor: active ? "var(--ant-color-primary)" : '',
  borderWidth: active ? 2 : 1,
  borderRadius: 6,
  fontWeight: 700,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: 4,
  height: 'unset',
  width: '100%',
  padding: '5px 9px'
  // flex: '1',
  // width: 'calc(100% / 5)',
  // minWidth: 'calc((100% / 7) - 20px)',
  // maxWidth: 250
});

const btnCSSActive: CSSProperties = {
  // background: 'unset',
  color: "var(--ant-button-default-color)",
  borderColor: "var(--ant-color-primary)",
  borderRadius: 6,
  fontWeight: 700,
};

// The vendor-list endpoint (GET /vendorlist) uses its own game_category
// vocabulary, which doesn't always line up 1:1 with the filter button values
// above. Confirmed from a live /vendorlist response: slot, casino, minigame,
// sports (no bare "live"/"special"). Map filter button value → vendor-list
// game_category (exact match) — only needed where the two differ.
const CATEGORY_TO_VENDOR_CAT: Record<string, string> = {
  live: "casino",
};

// 스포츠 has no single matching vendor-list category — it covers both
// "dsports-lobby" and "sports-lobby" — so it's matched by substring instead
// of the exact-match table above.
const SPORTS_VENDOR_CAT_MATCH = "sports";

const CategoryFilter = ({ setFilters, loading, hideAll }: Props) => {
  const [searchParam, setSearchParams] = useSearchParams();
  const { search } = useLocation();
  const { data: vendorList } = useVendorList();
  // An operator shouldn't see a filter tab for a product they don't run —
  // each tab follows its own product switch, see useCategoryVisibility.
  const isCategoryVisible = useCategoryVisibility();

  const activeCategory = searchParam.get("game_category") ?? "";
  const vendorCategory =
    CATEGORY_TO_VENDOR_CAT[activeCategory] ?? activeCategory;
  const visibleVendors = activeCategory
    ? (vendorList ?? []).filter((item) =>
        activeCategory === "sports"
          ? item.game_category.includes(SPORTS_VENDOR_CAT_MATCH)
          : item.game_category === vendorCategory
      )
    : vendorList ?? [];

  const handleGameCatBtn = (value: GameCatButtonProps["value"]) => {
    if (loading) return;
    const query = parse(search.replace("?", ""));
    if (query.game_category === value) {
        setSearchParams({ ...query, game_category: "" });
        setFilters((prevData: any) => ({
            ...prevData,
            game_category: null,
        }));
    } else {
        setSearchParams({ ...query, game_category: value, game_id: "" });
        setFilters((prevData: any) => ({
          ...prevData,
          game_category: value ?? null,
          game_id: null,
        }));
    }

    // mutate();
  };
  const handleProviderID = (value: GameCatButtonProps["value"], adtlFilter?: Record<string, any>) => {
    if (loading) return;
    const query = parse(search.replace("?", ""));
    if (query.game_id === value) {
        setSearchParams({ ...query, game_id: "", ...adtlFilter });
        setFilters((prevData: any) => ({
            ...prevData,
            game_id: null,
        }));
    } else {
        setSearchParams({ ...query, game_id: value,  ...adtlFilter });
        setFilters((prevData: any) => ({
          ...prevData,
          game_id: value ?? null,
        }));
    }

    // mutate();
  };

  const buttonItems = (hideAll ? GameCatBtnData.filter((item) => item.value !== "") : GameCatBtnData).filter((item) =>
    isCategoryVisible(item.value)
  );

  return (
    <>
    <Space direction="vertical" style={{width: '100%'}}>
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
      <Row gutter={[8, 8]}>
        {visibleVendors.map((item, index) => (
          <Col key={index} className="row-gutter" flex={"0 1 110px"}>
            <Button
              key={index}
              style={ProviderBtnCSS(searchParam.get("game_id") === item.vendor_id)}
              onClick={() => handleProviderID(item.vendor_id)}
            >
              <div style={{ fontSize: 10 }}>{item.vendor_id.toUpperCase()}</div>
            </Button>
          </Col>
        ))}
      </Row>
    </Space>
    </>
  );
};

export default CategoryFilter;
