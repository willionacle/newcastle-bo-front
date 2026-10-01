import { create } from "zustand";
import type { SuspiciousLatest, SuspiciousLogin } from "@/api/admin-login-log/get";

export interface AdminIpAlertState {
  count: number;
  distinctIps: number;
  latest: SuspiciousLatest | null;
  hasAlert: boolean;
  windowHours: number;
}

interface AdminIpAlertAction {
  setAlert: (data: SuspiciousLogin) => void;
  reset: () => void;
}

const initialState: AdminIpAlertState = {
  count: 0,
  distinctIps: 0,
  latest: null,
  hasAlert: false,
  windowHours: 24,
};

/**
 * Admin logins from unregistered IPs (polled from Layout). Not persisted — a
 * badge briefly missing after reload beats a cleared warning coming back.
 */
const adminIpAlertStore = create<AdminIpAlertState & AdminIpAlertAction>()(
  (set) => ({
    ...initialState,
    setAlert: (data) =>
      set((prev) => {
        const next: AdminIpAlertState = {
          count: data?.count ?? 0,
          distinctIps: data?.distinct_ips ?? 0,
          latest: data?.latest ?? null,
          hasAlert: !!data?.has_alert,
          windowHours: data?.window_hours ?? prev.windowHours,
        };

        // Same values -> keep the same state object so the side menu doesn't re-render
        if (
          prev.count === next.count &&
          prev.distinctIps === next.distinctIps &&
          prev.hasAlert === next.hasAlert &&
          prev.windowHours === next.windowHours &&
          prev.latest?.id === next.latest?.id
        ) {
          return prev;
        }
        return next;
      }),
    reset: () => set(initialState),
  })
);

export default adminIpAlertStore;
