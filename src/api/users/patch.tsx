import useUserStore from "@/store/user.store";
import instance from "../axios";

export interface UpdateUserStatusRequest {
  username: string;
  user_status: string;
}

export interface UpdateUserStatusResponse {
  code: number;
  data: {
    username: string;
    user_status: string;
    updated: boolean;
  };
  message: string;
}

export const updateUserStatusAPI = async (
  body: UpdateUserStatusRequest
): Promise<UpdateUserStatusResponse> => {
  const token = useUserStore.getState().token;

  const { data } = await instance.patch<UpdateUserStatusResponse>(
    "/api/users/update-user-status",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const resetLoginAttemptsAPI = async (username: string) => {
  const token = useUserStore.getState().token;

  const { data } = await instance.patch(
    `/api/users/${username}/reset-login-attempts`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// PASSWORD_RESET_AND_IMPERSONATION_FRONTEND_INTEGRATION.md §2. Replaces the
// old "read decode_password off the member row" — plaintext is gone from the
// database. `password` omitted → the server generates a 12-character one. The
// value comes back exactly once and is not stored anywhere; the member's
// sessions end (`signedOut`) and the failed-login counter is reset.
// Refusals are HTTP 200 `code: 1` (member not found / admin account).
export interface SetPasswordData {
  username: string;
  password: string;
  signedOut: boolean;
}

export const setUserPasswordAPI = async (
  username: string,
  password?: string
): Promise<{ code: number; message: string; data?: SetPasswordData }> => {
  const token = useUserStore.getState().token;

  const { data } = await instance.patch(
    `/api/users/${encodeURIComponent(username)}/password`,
    password ? { password } : {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      silent: true,
    }
  );

  return data;
};
