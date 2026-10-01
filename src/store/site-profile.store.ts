import { create } from "zustand";
import { SiteProfileData } from "@/api/site-profile/get";

// Not persisted — always a fresh read from GET /api/site-profile on load
// (SideNav.tsx), same as topbarStore's polling data but without the
// localStorage mirror, since a stale hideSportsMenus flag would show/hide
// the wrong menus on next login before the first fetch lands.
type State = { data: SiteProfileData | null };
type Actions = { setSiteProfile: (data: SiteProfileData) => void };

const useSiteProfileStore = create<State & Actions>()((set) => ({
  data: null,
  setSiteProfile: (data) => set({ data }),
}));

export default useSiteProfileStore;
