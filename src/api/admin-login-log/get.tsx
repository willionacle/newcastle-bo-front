import { useEffect } from "react";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import adminIpAlertStore from "@/store/adminIpAlert.store";

// Admin login IP monitoring (backend handoff §1, ported from nxseam-bo-front).

/** Detection window in hours. The backend accepts 1–720. */
export const SUSPICIOUS_WINDOW_HOURS = 24;

/** The side-menu badge does not need to be instant; 3 minutes is plenty. */
const POLL_MS = 1000 * 60 * 3;

/**
 * PrivateRouter's response interceptor toasts on every non-401 error. Calls in
 * this module handle failures themselves, so every status is accepted as
 * "success" and the caller checks `res.status` (mainly so a 404/5xx on the
 * 3-minute poll never toasts, and so the 403 for non-super admins can be shown
 * inside the modal instead).
 */
export const passThroughStatus = { validateStatus: () => true };

export interface SuspiciousLatest {
  id: number;
  user: string;
  ip: string;
  /** Readable location such as "KR 11 Seoul", or null */
  ip_location: string | null;
  login_date_time: string;
}

export interface SuspiciousLogin {
  count: number;
  distinct_ips: number;
  latest: SuspiciousLatest | null;
  window_hours: number;
  has_alert: boolean;
}

export interface RegisteredIp {
  ip: string;
  description: string | null;
  created_at: string;
}

/** SWR key of the registered-IP list (revalidated after add/delete). */
export const REGISTERED_IPS_KEY = "/api/admin-login-log/registered-ips";

/** SWR key of the detection result (revalidated after add/delete so the badge updates at once). */
export const SUSPICIOUS_KEY = `/api/admin-login-log/suspicious?hours=${SUSPICIOUS_WINDOW_HOURS}`;

/**
 * Polls admin logins from unregistered IPs and mirrors the result into
 * adminIpAlert.store, which useMenu reads to draw the ⚠ badge. Mount once (Layout).
 */
export const useSuspiciousAdminLoginAPI = () => {
  const token = useUserStore((s) => s.token);
  const setAlert = adminIpAlertStore((s) => s.setAlert);
  const reset = adminIpAlertStore((s) => s.reset);

  // Logged out / switched account: drop the previous session's badge.
  useEffect(() => {
    reset();
  }, [token]);

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<{ code: number; message: string; data: SuspiciousLogin }>
    >(url, {
      headers: { Authorization: `Bearer ${token}` },
      ...passThroughStatus,
    });

    // Any non-200 / code !== 0 is "no data" and ignored quietly.
    if (res.status !== 200 || res.data?.code !== 0) return null;

    setAlert(res.data.data);
    return res.data.data;
  };

  return useSWR(token ? SUSPICIOUS_KEY : null, fetcher, {
    refreshInterval: POLL_MS,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    onError: () => reset(),
  });
};

export const useRegisteredIpsAPI = (enabled: boolean) => {
  const token = useUserStore((s) => s.token);

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<{ code: number; message: string; data: RegisteredIp[] }>
    >(url, {
      headers: { Authorization: `Bearer ${token}` },
      ...passThroughStatus,
    });

    if (res.status !== 200 || res.data?.code !== 0) {
      throw new Error(res.data?.message || `HTTP ${res.status}`);
    }

    return Array.isArray(res.data.data) ? res.data.data : [];
  };

  return useSWR(enabled && token ? REGISTERED_IPS_KEY : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
};
