import { AxiosResponse } from "axios";
import instance from "../axios";
import { AdminAccount } from "./get";

interface Res<T = undefined> {
  code: number;
  message: string;
  data: T;
}

// `from` names the admin whose row is cloned — up_users has 153 columns and a
// hand-built INSERT produces an account that looks right and cannot log in.
// Omit it and the server picks an existing admin on this client.
//
// There is no `isSuperAdmin` field on purpose: the server refuses a create that
// asks for the tier ("A new account cannot be created as super admin. Create
// it, then transfer the super-admin role to it."). Sending it only turns a
// working create into a refusal.
export interface CreateAdminAccountBody {
  username: string;
  password: string;
  name?: string;
  from?: string;
  role?: string;
}

export const createAdminAccountAPI = (body: CreateAdminAccountBody, token: string) => {
  return instance.post<CreateAdminAccountBody, AxiosResponse<Res<AdminAccount>>>(
    "/api/admin-accounts",
    body,
    { headers: { Authorization: `Bearer ${token}` }, silent: true }
  );
};

// Changing your own password revokes every session on the account, including
// the one making this call — `data.reauthRequired` says so. The caller must send
// the operator to /login rather than let the next request 401 at random.
//
// The current password is required even though the session already proves the
// account: the session proves the account, not the person sitting at it.
export interface ChangeOwnPasswordBody {
  currentPassword: string;
  newPassword: string;
}

export const changeOwnPasswordAPI = (body: ChangeOwnPasswordBody, token: string) => {
  return instance.post<
    ChangeOwnPasswordBody,
    AxiosResponse<Res<{ reauthRequired?: boolean }>>
  >("/api/admin-accounts/me/password", body, {
    headers: { Authorization: `Bearer ${token}` },
    silent: true,
  });
};
