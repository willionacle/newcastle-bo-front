import { useCallback } from "react";
import { SiteProfileCategories } from "@/api/site-profile/get";
import useSiteProfileStore from "@/store/site-profile.store";

// Every game_category filter value used across the BO, mapped to the product
// switch that governs it (PRODUCT_PROFILE_FRONTEND_INTEGRATION.md §2). Three
// vocabularies end up here — plain categories ("slot"), lobby values
// ("slot-lobby") and the ITF parlay values — so a single switch hides its
// tab everywhere it appears. "live" is 카지노; that's the DB column name.
// Values absent from this table (notably "" = 전체) are always visible.
const CATEGORY_BY_FILTER_VALUE: Record<string, keyof SiteProfileCategories> = {
  slot: "slot",
  "slot-lobby": "slot",
  minigame: "minigame",
  "minigame-lobby": "minigame",
  live: "live",
  "live-lobby": "live",
  casino: "live",
  special: "special",
  sports: "sports",
  "sports-lobby": "sports",
  "dsports-lobby": "sports",
  itf_parlay: "sports",
  itf_intl_parlay: "sports",
  itf_special_parlay: "sports",
};

// Returns a predicate for filtering category buttons/tabs. Sports keeps using
// the server-derived hideSportsMenus flag rather than categories.sports — that
// flag is what the rest of the sports hiding is bound to. Everything else reads
// its switch straight off categories.
//
// Hiding is not access control — the endpoints still answer. It only stops an
// operator seeing tabs for a product they don't sell. While the profile is
// still loading (data === null) every tab stays visible.
const useCategoryVisibility = () => {
  const profile = useSiteProfileStore((state) => state.data);

  return useCallback(
    (value: string) => {
      if (!profile) return true;
      const key = CATEGORY_BY_FILTER_VALUE[value];
      if (!key) return true;
      if (key === "sports") return !profile.hideSportsMenus;
      return profile.categories[key];
    },
    [profile]
  );
};

export default useCategoryVisibility;
