import { AxiosResponse } from "axios";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import { RegisteredIp, passThroughStatus } from "./get";

export interface AddRegisteredIpBody {
  ip: string;
  description?: string;
}

export interface RegisteredIpResult {
  ok: boolean;
  status: number;
  message?: string;
  data?: RegisteredIp;
}

/**
 * Super admin only (others get 403 + message). 201 = newly registered,
 * 200 = already registered (idempotent).
 */
export const addRegisteredIpAPI = async (
  body: AddRegisteredIpBody
): Promise<RegisteredIpResult> => {
  const token = useUserStore.getState().token;

  const res = await instance.post<
    AddRegisteredIpBody,
    AxiosResponse<{ code: number; message: string; data: RegisteredIp }>
  >("/api/admin-login-log/registered-ips", body, {
    headers: { Authorization: `Bearer ${token}` },
    ...passThroughStatus,
  });

  return {
    ok: (res.status === 200 || res.status === 201) && res.data?.code === 0,
    status: res.status,
    message: res.data?.message,
    data: res.data?.data,
  };
};
