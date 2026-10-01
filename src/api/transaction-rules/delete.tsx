import instance from "../axios";
import { AxiosResponse } from "axios";
import { TransactionRuleDeleteRes } from "./types";

// The global rule can't be deleted server-side (use isActive instead) — the
// list UI hides the delete button for it, but a stale-page attempt still
// comes back as a code:1 refusal here.
export const deleteTransactionRuleAPI = (id: number, token: string) => {
  return instance.delete<undefined, AxiosResponse<TransactionRuleDeleteRes>>(
    `/api/transaction-rules/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
