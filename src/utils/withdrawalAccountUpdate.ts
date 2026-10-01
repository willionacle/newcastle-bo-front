/**
 * Builds the body for PATCH /api/users/:id/withdrawal-account
 * (NEWCASTLE_HANDOFF_FRONTEND_INTEGRATION §2.2) from the member edit form.
 *
 * Absent key = unchanged on the server, `null` / "" = cleared. Only fields the
 * operator actually edited are sent. CodePay was removed on Newcastle, so
 * there is no `codepaySimpleAddress`.
 */
const fieldMap = {
  bank_name: "bankName",
  account_number: "accountNumber",
  account_name: "accountName",
  network: "network",
  wallet_address: "walletAddress",
  isAllowedAccountWithdrawal: "isAllowedAccountWithdrawal",
  isAllowedOncashWithdrawal: "isAllowedOncashWithdrawal",
} as const;

export type WithdrawalFormField = keyof typeof fieldMap;
export type WithdrawalNetwork = "TRC-20" | "ERC-20";

export const withdrawalFields = Object.keys(fieldMap) as WithdrawalFormField[];

export interface WithdrawalAccountUpdate {
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  network?: WithdrawalNetwork | null;
  walletAddress?: string | null;
  isAllowedAccountWithdrawal?: boolean;
  isAllowedOncashWithdrawal?: boolean;
}

const normalise = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  return value ?? null;
};

export function withdrawalAccountUpdate(
  values: Partial<Record<WithdrawalFormField, unknown>>,
  changed: (key: WithdrawalFormField) => boolean
): WithdrawalAccountUpdate {
  const result: Record<string, unknown> = {};
  for (const key of withdrawalFields) {
    if (!changed(key)) continue;
    result[fieldMap[key]] = normalise(values[key]);
  }
  return result as WithdrawalAccountUpdate;
}

// TRC-20: "T" + 33 base58 characters. ERC-20: "0x" + 40 hex. The server
// answers 400 otherwise, so check before asking for the access password.
const WALLET_PATTERNS: Record<WithdrawalNetwork, RegExp> = {
  "TRC-20": /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  "ERC-20": /^0x[0-9a-fA-F]{40}$/,
};

export function isValidWalletAddress(network: unknown, address: unknown): boolean {
  if (typeof address !== "string" || address.trim() === "") return true; // empty = cleared
  const pattern = WALLET_PATTERNS[network as WithdrawalNetwork];
  return pattern ? pattern.test(address.trim()) : false;
}

/** A masked echo from the member row (`*`, `•`, `●`) is not a real value. */
export function isMaskedValue(value: unknown): boolean {
  return typeof value === "string" && /[*•●]/.test(value);
}
