import useUserStore from "@/store/user.store";
import instance from "../axios";
import type { WithdrawalAccountUpdate } from "@/utils/withdrawalAccountUpdate";

// NEWCASTLE_HANDOFF_FRONTEND_INTEGRATION §2. The access password is the
// admin's own login password. Wrong password / expired view token → 403,
// too many attempts → 429; never 401. All calls here are `silent` so the
// global interceptor does not add a raw "status code 403" toast — callers
// render the server's message inline (see utils/sensitiveError.ts).

/** `password` is not revealable on Newcastle (HTTP 410) — plaintext is gone. */
export type SensitiveField = "phone" | "withdrawalAccount" | "usdtWallet";

/**
 * phone → phone_number; withdrawalAccount → bank_name, account_number,
 * account_name; usdtWallet → w_network, w_wallet_address.
 */
export type SensitiveValue = Record<string, string | null>;

export type SensitiveCredential = { accessPassword: string } | { viewToken: string };

export interface RevealSensitiveResponse {
  code: number;
  message?: string;
  data?: { value: SensitiveValue; viewToken: string };
}

export async function revealSensitiveInformationAPI(
  userId: number,
  field: SensitiveField,
  credential: SensitiveCredential
): Promise<RevealSensitiveResponse> {
  const token = useUserStore.getState().token;
  const { data } = await instance.post<RevealSensitiveResponse>(
    `/api/users/${userId}/sensitive/reveal`,
    { field, ...credential },
    {
      headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-store" },
      silent: true,
    }
  );
  return data;
}

// §2.2 — only changed keys are sent; accessPassword is required.
export async function updateWithdrawalAccountAPI(
  userId: number,
  body: WithdrawalAccountUpdate,
  accessPassword: string
): Promise<{ code: number; message: string; data?: { changed: string[] } }> {
  const token = useUserStore.getState().token;
  const { data } = await instance.patch(
    `/api/users/${userId}/withdrawal-account`,
    { ...body, accessPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
      silent: true,
    }
  );
  return data;
}
