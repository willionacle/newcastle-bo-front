import { create } from "zustand";
import { persist } from "zustand/middleware";

type OpenMap = Record<string, boolean>;

type State = { open: OpenMap };
type Actions = {
  initKeys: (keys: { key: string; depth: number }[]) => void;
  toggle: (key: string) => void;
};

export const useSideNavStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      open: {},
      initKeys: (keys) => {
        const curr = get().open;
        const next: OpenMap = { ...curr };
        let changed = false;
        for (const { key, depth } of keys) {
          if (!(key in next)) {
            next[key] = depth === 0;
            changed = true;
          }
        }
        if (changed) set({ open: next });
      },
      toggle: (key) => {
        const v = get().open[key] ?? false;
        set((s) => ({ open: { ...s.open, [key]: !v } }));
      },
    }),
    { name: "side-nav-open" }
  )
);