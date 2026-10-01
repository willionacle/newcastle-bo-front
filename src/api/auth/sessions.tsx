import { AxiosResponse } from "axios";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import useSWR from "swr";

// One live login on the caller's own account (multi-session backend, 2026-08).
// `browser` / `device` / `system` come from a User-Agent parser server-side —
// an unusual or malformed UA can land here as "undefined undefined", so
// callers should fall back to a placeholder rather than render it raw.
export interface AdminSession {
  id: number;
  operator: string | null;
  ip: string;
  browser: string;
  device: string;
  system: string;
  issuedAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

interface ResSessions {
  code: number;
  message: string;
  data: AdminSession[];
}

interface ResEndSession {
  code: number;
  message: string;
}

// Only ever returns/affects the caller's own account — there is no way to
// reach another account's sessions, even by guessing an id.
export const useSessionsAPI = () => {
  const { token } = useUserStore.getState();

  const fetcher = async ([url]: [string]) => {
    const res = await instance.get<null, AxiosResponse<ResSessions>>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const swr = useSWR(["/api/auth/sessions"], fetcher);

  return { swr };
};

// Ends one session by id. Scoped server-side to the caller's own account.
// If it is the session making this very call, the holder's next request
// gets a 401 — same as any other expired/revoked token.
export const endSessionAPI = async (id: number, token: string) => {
  const res = await instance.delete<null, AxiosResponse<ResEndSession>>(
    `/api/auth/sessions/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
