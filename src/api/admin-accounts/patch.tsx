import { AxiosResponse } from "axios";
import instance from "../axios";

interface Res<T = undefined> {
  code: number;
  message: string;
  data: T;
}

const auth = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
  // These routes refuse with code 1 (guards) or 403 (tier) as a matter of
  // course; the screens surface the server's message, so no global toast.
  silent: true,
});

// Set another admin's password. Signs that account out of every live session —
// a password change that leaves the old sessions alive locks nobody out.
export const setAdminPasswordAPI = (id: number, password: string, token: string) => {
  return instance.patch<{ password: string }, AxiosResponse<Res>>(
    `/api/admin-accounts/${id}/password`,
    { password },
    auth(token)
  );
};

// Stop / restart an account. `active: false` moves user_status away from ACTIVE
// (which login requires) and revokes its sessions; nothing is deleted, so it is
// fully reversible. Refused by the server for your own account, for the last
// active super admin, and for a no-op transition.
export const setAdminStatusAPI = (id: number, active: boolean, token: string) => {
  return instance.patch<{ active: boolean }, AxiosResponse<Res>>(
    `/api/admin-accounts/${id}/status`,
    { active },
    auth(token)
  );
};

// `super: true` is a transfer, not a grant: there is exactly one super admin,
// and handing the tier to someone takes it from everyone else in the same call
// - the caller included. `callerDemoted` is the server saying this session just
// lost it, and the screen has to act on it: every management button would 403
// from that point on.
//
// `super: false` is refused while only one admin holds the tier ("There must
// always be exactly one super admin"), and always refused for your own account.
export interface SuperChangeData {
  superAdmin: string;
  demoted: string[];
  callerDemoted: boolean;
}

export const setAdminSuperAPI = (id: number, isSuper: boolean, token: string) => {
  return instance.patch<{ super: boolean }, AxiosResponse<Res<SuperChangeData>>>(
    `/api/admin-accounts/${id}/super`,
    { super: isSuper },
    auth(token)
  );
};
