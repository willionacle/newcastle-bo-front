import { create } from "zustand";

// Whether the signed-in admin holds the super-admin tier. Read from
// `isSuperAdmin` on /api/auth/validate (and on the login response, for the first
// paint), re-read on every route change: the tier moves without a logout, since
// a transfer demotes the previous holder in the same call.
//
// Not persisted: a stale `true` in localStorage would show a privileged menu to
// an admin whose tier moved while they were away, and it is cheap to re-derive.
//
// Tri-state on purpose. `null` means "not known here yet" — the validate call is
// in flight, or it failed for a reason that is not an answer (network, 5xx); the
// server itself never sends null, not even on a client whose database predates
// the migration. The 관리자 계정 관리 menu stays hidden until this is a definite
// `true`, so a privileged entry never flashes in and back out during load.
//
// Hiding is not access control either way: every /api/admin-accounts route is
// gated server-side and fails closed. This only keeps operators from clicking
// into a screen that would 403 on them.
type State = { isSuperAdmin: boolean | null };
type Actions = { setIsSuperAdmin: (value: boolean | null) => void };

const useAdminAccessStore = create<State & Actions>()((set) => ({
  isSuperAdmin: null,
  setIsSuperAdmin: (value) => set({ isSuperAdmin: value }),
}));

export default useAdminAccessStore;
