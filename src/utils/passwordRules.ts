import type { Rule } from "antd/es/form";
import type { TFunction } from "i18next";

// bcrypt silently truncates its input at 72 BYTES. Korean is 3 bytes per
// character in UTF-8, so a 30-character Korean passphrase would lose its tail
// with no error anywhere — the account would then accept a password nobody
// typed. The cap is therefore counted in bytes, not characters, and antd's
// `max` rule (which counts characters) is deliberately not used.
export const PASSWORD_MIN_CHARS = 10;
export const PASSWORD_MAX_BYTES = 72;

export const passwordByteLength = (value: string) =>
  new TextEncoder().encode(value).length;

// Same limits the backend enforces. Validating here only saves a round trip —
// the server refuses out-of-range passwords regardless.
export const passwordRules = (t: TFunction): Rule[] => [
  { required: true, message: t("adminAccounts.passwordRequired") },
  {
    validator: (_, value: string) => {
      if (!value) return Promise.resolve();

      if (value.length < PASSWORD_MIN_CHARS) {
        return Promise.reject(
          new Error(t("adminAccounts.passwordTooShort", { min: PASSWORD_MIN_CHARS }))
        );
      }

      if (passwordByteLength(value) > PASSWORD_MAX_BYTES) {
        return Promise.reject(
          new Error(t("adminAccounts.passwordTooLong", { max: PASSWORD_MAX_BYTES }))
        );
      }

      return Promise.resolve();
    },
  },
];
