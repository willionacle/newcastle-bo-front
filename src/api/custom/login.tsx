import { AxiosResponse } from "axios";
import useSWR from "swr";
import { useLocation } from "react-router-dom";
import instance from "../axios";
import useUserStore, { UserState } from "@/store/user.store";
import useAdminAccessStore from "@/store/admin-access.store";

export interface PostLogin {
  username: string;
  password: string;
  user_agent: string;
  // 담당자 — who is using this shared account, for the audit trail. Optional,
  // max 64 chars free text; omit and the account name alone is recorded.
  operator?: string;
}

// First-time enrolment payload (only present until the manager has set up OTP).
export interface OtpSetup {
  secret: string;
  account: string;
  issuer: string;
  type: string;
  otpauthUrl: string;
}

// The session fields /api/auth/login used to return before OTP existed — and
// returns again whenever 2FA is off (see OTP_LOGIN_ENABLED in Login.tsx).
export type SessionData = UserState & { userId: number };

// With 2FA on, /api/auth/login returns a short-lived OTP token only and the
// real session is issued by /api/auth/login/verify. With 2FA off the session
// comes straight back from /login, so both shapes are optional here and the
// caller decides by looking for `token`.
export interface LoginData extends Partial<SessionData> {
  otpToken?: string;
  twofaEnabled?: boolean;
  setup?: OtpSetup;
  // The super-admin tier. Deliberately not part of SessionData: the user store
  // is persisted, and a saved `true` would show the 관리자 계정 관리 menu to
  // an admin whose tier moved while they were away. Read it into
  // admin-access.store.ts instead, and re-read it from /api/auth/validate on
  // every page load.
  isSuperAdmin?: boolean;
}

interface ResPostLogin {
  message: string;
  code: number;
  data: LoginData;
}

// /api/auth/login/verify returns the same shape the old /login used to:
// data carries the session token + user fields.
interface ResVerifyOtp {
  message: string;
  code: number;
  data: SessionData & { isSuperAdmin?: boolean };
}

// True when the backend already handed us a usable session (2FA off) instead of
// an otpToken, so the OTP step can be skipped.
export const hasSession = (data?: LoginData): data is LoginData & SessionData =>
  Boolean(data?.token);

// Step 1: username + password. On success the response tells us whether the
// manager still needs to enrol (data.setup) and gives us the otpToken to carry
// into the verify step.
export const loginAPI = async (body: PostLogin) => {
  const res = await instance.post<PostLogin, AxiosResponse<ResPostLogin>>(
    "/api/auth/login",
    body
  );

  return res.data;
};

// Step 2: submit the 6-digit Google Authenticator code. The otpToken from step 1
// is the bearer token; success returns the real session.
export const verifyOtpAPI = async (code: string, otpToken: string) => {
  const res = await instance.post<{ code: string }, AxiosResponse<ResVerifyOtp>>(
    "/api/auth/login/verify",
    { code },
    { headers: { Authorization: `Bearer ${otpToken}` } }
  );

  return res.data;
};

// ---------------------------------------------------------------------------
// Session validation
// ---------------------------------------------------------------------------

// `role` is "admin" for every back-office user and says nothing about the tier;
// `isSuperAdmin` is the only thing that does. It is always a boolean on the
// wire — on a client whose database has not applied
// migrations/2026-09-admin-accounts.sql the column does not exist and the server
// coerces it to false, so "unknown" never reaches the browser as a value that
// could be mistaken for "show the menu".
export interface AuthValidateData {
  userId: number;
  username: string;
  role: string;
  userRealName: string;
  isSuperAdmin: boolean;
}

interface ResAuthValidate {
  code: number;
  message: string;
  data: AuthValidateData | null;
}

// The tier moves without anyone logging out: a transfer demotes the previous
// holder in the same call. So the menu cannot run on a value saved at login —
// this asks again on every route change (the pathname is part of the SWR key)
// and mirrors the answer into admin-access.store.ts, which is not persisted.
//
// Mounted once, in SideNav.
export const useAuthValidateAPI = () => {
  const { token } = useUserStore.getState();
  const { pathname } = useLocation();
  const setIsSuperAdmin = useAdminAccessStore((state) => state.setIsSuperAdmin);

  const fetcher = async () => {
    try {
      const res = await instance.get<undefined, AxiosResponse<ResAuthValidate>>(
        "/api/auth/validate",
        {
          // Handled here; no global toast. See PrivateRouter.tsx.
          headers: { Authorization: `Bearer ${token}` },
          silent: true,
        }
      );

      const value = res.data?.code === 0 && res.data.data?.isSuperAdmin === true;
      setIsSuperAdmin(value);
      return value;
    } catch {
      // 401 is a dead session and PrivateRouter's interceptor is already taking
      // the operator to /login. Anything else (network, 5xx) is not an answer —
      // stay unknown so a blip doesn't read as a revoked tier.
      setIsSuperAdmin(null);
      return null;
    }
  };

  return useSWR(token ? ["/api/auth/validate", pathname] : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
};

interface ResLogout {
  code: number;
  message: string;
}

// Ends only the calling session server-side (multi-session backend, 2026-08).
// Best-effort: if the token is already expired/revoked this 401s, which the
// caller should swallow — the local logout proceeds regardless.
export const logoutAPI = async (token: string) => {
  const res = await instance.post<null, AxiosResponse<ResLogout>>(
    "/api/auth/logout",
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
