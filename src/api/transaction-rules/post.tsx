import instance from "../axios";
import { AxiosResponse } from "axios";
import { TransactionRuleBody, TransactionRuleRes } from "./types";

// This is always POST, never PUT-by-id — the API has no PUT verb for rules.
// It upserts keyed on (targetType, targetValue), not on id, and replaces the
// whole row (omitted fields are stored as null). The "create vs edit" UI
// distinction only changes which record pre-fills the form before submit.
export const upsertTransactionRuleAPI = (body: TransactionRuleBody, token: string) => {
  return instance.post<TransactionRuleBody, AxiosResponse<TransactionRuleRes>>(
    "/api/transaction-rules",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
