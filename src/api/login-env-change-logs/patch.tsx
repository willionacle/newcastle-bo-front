import useUserStore from "@/store/user.store";
import instance from "../axios";

interface RestoreResponse {
  code: number;
  message: string;
}

interface WhitelistResponse {
  code: number;
  message: string;
}

export const restoreVAccounts = async (id: number) => {
  const token = useUserStore.getState().token;

  const res = await instance.patch<undefined, { data: RestoreResponse }>(
    `/api/login-env-change-logs/${id}/restore`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const toggleWhitelist = async (
  username: string,
  isWhitelist: boolean
) => {
  const token = useUserStore.getState().token;

  const res = await instance.patch<
    { username: string; isWhitelist: boolean },
    { data: WhitelistResponse }
  >(
    `/api/login-env-change-logs/whitelist`,
    { username, isWhitelist },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
