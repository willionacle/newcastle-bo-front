import { User } from "@/api/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface UserListState {
  userList: User[];
}

interface UserAction {
  setUserListData: (data: User[]) => void;
}

const initialState: UserListState = {
  userList: [],
};

const useUserListStore = create<UserListState & UserAction>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setUserListData: (data) => set(() => ({ userList: data })),
      }),
      {
        name: "userListStore",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          userList: state.userList.map((user) => ({
            username: user.username,
            created_at: user.created_at,
            user_status: user.user_status,
            user_real_name: user.user_real_name,
          })),
        }),
      }
    )
  )
);

export default useUserListStore;
