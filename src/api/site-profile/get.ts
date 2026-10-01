import instance from "../axios";
import useUserStore from "@/store/user.store";
import { AxiosResponse } from "axios";
import { PostRes } from "../types";
import useSWR from "swr";
import useSiteProfileStore from "@/store/site-profile.store";

// Five independent product switches, plus a derived preset label — see
// PRODUCT_PROFILE_FRONTEND_INTEGRATION.md. "live" is casino (that's the
// column name in the DB); label it 카지노 on screen, nothing translates it.
export interface SiteProfileCategories {
  live: boolean;
  slot: boolean;
  sports: boolean;
  minigame: boolean;
  special: boolean;
}

export type SiteProfilePreset = "SPORTS_AND_CASINO" | "CASINO_ONLY" | "CUSTOM";

export interface SiteProfileData {
  categories: SiteProfileCategories;
  preset: SiteProfilePreset;
  hideSportsMenus: boolean;
}

// Called from SideNav.tsx alongside totalStaticsAPI — same shape: an SWR
// hook whose fetcher also mirrors the result into a zustand store, so
// useMenu can read hideSportsMenus synchronously without its own fetch.
export const useSiteProfileAPI = () => {
  const { token } = useUserStore.getState();
  const setSiteProfile = useSiteProfileStore((state) => state.setSiteProfile);

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<PostRes<SiteProfileData>>>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSiteProfile(res.data.data);
    return res.data;
  };

  return useSWR("/api/site-profile", fetcher);
};
