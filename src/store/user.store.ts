import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface UserState {
  userid: number;
  username: string;
  userRealName: string;
  token: string;
  // 담당자 — the operator name entered at login, when the account is shared
  // (multi-session backend, 2026-08). Null when not supplied.
  operator: string | null;
}

interface UserAction {
  setUser: (data: UserState) => void;
  resetUser: () => void;
}

const initialState: UserState = {
  token: "",
  userid: -1,
  userRealName: "",
  username: "",
  operator: null,
};

const useUserStore = create<UserState & UserAction>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setUser: (data) => {
          set(() => ({ ...data }))
        },
        resetUser: () => {
          set(initialState);
        },
      }),
      {
        name: "smb",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useUserStore;
