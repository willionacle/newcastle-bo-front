/**
 * Classifies failures from the access-password protected member endpoints
 * (sensitive reveal, withdrawal-account PATCH, PATCH /api/users).
 *
 * NEWCASTLE_HANDOFF_FRONTEND_INTEGRATION §2: wrong access password or an
 * expired/foreign viewToken → 403 (clear the cached token, ask again);
 * 5 wrong passwords in 10 minutes → 429 (show the message, retry later).
 * Neither is a logout. These calls are sent with `silent: true`, so the
 * global interceptor stays quiet and the caller renders the message inline.
 */
export type SensitiveErrorKind = "auth" | "rateLimited" | "gone" | "invalid" | "other";

export interface SensitiveError {
  kind: SensitiveErrorKind;
  /** Server message when there is one, else undefined (caller picks a fallback). */
  message?: string;
}

export function classifySensitiveError(error: unknown): SensitiveError {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })?.response;
  const raw = response?.data?.message;
  const message = typeof raw === "string" && raw.trim() ? raw : undefined;
  switch (response?.status) {
    case 403:
      return { kind: "auth", message };
    case 429:
      return { kind: "rateLimited", message };
    case 410:
      return { kind: "gone", message };
    case 400:
      return { kind: "invalid", message };
    default:
      return {
        kind: "other",
        message: message ?? (error instanceof Error && !response ? error.message : undefined),
      };
  }
}
