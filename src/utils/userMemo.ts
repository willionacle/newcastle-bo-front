/**
 * 유저 메모 card merges 총판 공유 into 메모사항 and 영업팀 공유 into 공유사항.
 * `legacy` columns are retired: read into `primary` for display, blanked on save.
 */
export interface MemoMerge {
  primary: string;
  legacy: string;
}

export const MEMO_MERGES: MemoMerge[] = [
  { primary: "user_memo_2", legacy: "user_memo_5" },
  { primary: "user_memo_3", legacy: "user_memo_6" },
];

export const legacyMemoOf = (primary: string) =>
  MEMO_MERGES.find((merge) => merge.primary === primary)?.legacy;

export const joinNote = (primary: unknown, legacy: unknown) =>
  [primary, legacy].filter((value) => value && String(value).trim()).join("\n");

/**
 * Memo payload for callers that spread a whole user record into updateUser.
 * Idempotent, so a stale snapshot still yields the merged value rather than
 * resurrecting the retired column's text. Agent records must not go through
 * this — only user_memo_1 has a defined meaning there.
 */
export const mergeUserMemos = (data: unknown): Record<string, string> => {
  const memos: Record<string, string> = {};
  if (!data || typeof data !== "object") return memos;

  const row = data as Record<string, unknown>;
  MEMO_MERGES.forEach(({ primary, legacy }) => {
    // Never introduce a key the record lacks — an absent field is written as NULL.
    if (!(primary in row) && !(legacy in row)) return;
    memos[primary] = joinNote(row[primary], row[legacy]);
    memos[legacy] = "";
  });

  return memos;
};
