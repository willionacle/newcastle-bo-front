/**
 * General member saves (PUT /api/users) must never carry credentials, the
 * phone number or the protected withdrawal-account fields.
 *
 * NEWCASTLE_HANDOFF_FRONTEND_INTEGRATION §2.4: a field left out of
 * PUT /api/users keeps its stored value (phoneNumber, telcode, bankName,
 * accountNumber, accountName, network, walletAddress, password). Those fields
 * are changed only through their own access-password protected endpoints:
 * 비밀번호 재설정 (PATCH /api/users/:username/password), PATCH /api/users
 * (phone_number / telcode) and PATCH /api/users/:id/withdrawal-account.
 *
 * Spreading a whole member row into the save used to echo whatever the row
 * held (possibly masked values) back to the server; this strips them.
 * Agent saves go through /updateagent and are not passed through here.
 */
const CREDENTIAL_KEYS = [
  "password",
  "newPassword",
  "decode_password",
  "decodePassword",
  "accessPassword",
] as const;

const CONTACT_KEYS = ["phone_number", "phoneNumber", "telcode"] as const;

const ACCOUNT_KEYS = [
  "bank_name",
  "bankName",
  "account_number",
  "accountNumber",
  "account_name",
  "accountName",
  "network",
  "wallet_address",
  "walletAddress",
  "w_network",
  "w_wallet_address",
] as const;

export function ordinaryUserUpdate<T extends Record<string, any>>(data: T): T {
  const clean: Record<string, any> = { ...data };
  for (const key of [...CREDENTIAL_KEYS, ...CONTACT_KEYS, ...ACCOUNT_KEYS]) {
    delete clean[key];
  }
  return clean as T;
}
