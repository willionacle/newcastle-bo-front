import { StatsDataType } from "@/api/cs-statics/totalStatics";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface TopBarState {
  deposit_applied: number;
  withdraw_applied: number;
}

interface UserAction {
  setTopbarData: (data: StatsDataType) => void
}

const initialState: TopBarState = {
  deposit_applied: 0,
  withdraw_applied: 0
};

const topbarStore = create<TopBarState & UserAction>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setTopbarData: (data) => set(() => ({...data}))
      }),
      {
        name: "topbarStore",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default topbarStore;
