// Every /api/admin-accounts refusal carries a server-written message: the guard
// that fired, or the name of the migration file that has not been applied on
// this client yet. It is the only thing that tells the operator what happened,
// so it is shown verbatim and a local fallback is used only when there is none.
export const serverMessage = (error: any, fallback: string): string =>
  error?.response?.data?.message || fallback;

// 403 from any /api/admin-accounts route means the tier said no — the caller is
// not a super admin, or the check failed closed.
export const httpStatus = (error: any): number | undefined => error?.response?.status;
