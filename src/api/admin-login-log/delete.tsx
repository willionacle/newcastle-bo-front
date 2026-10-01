import { AxiosResponse } from "axios";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import { RegisteredIpResult } from "./post";
import { passThroughStatus } from "./get";

/** Super admin only (others get 403). 404 if the IP is not registered. */
export const deleteRegisteredIpAPI = async (
  ip: string
): Promise<RegisteredIpResult> => {
  const token = useUserStore.getState().token;

  const res = await instance.delete<
    undefined,
    AxiosResponse<{ code: number; message: string }>
  >(`/api/admin-login-log/registered-ips/${encodeURIComponent(ip)}`, {
    headers: { Authorization: `Bearer ${token}` },
    ...passThroughStatus,
  });

  return {
    ok: res.status === 200 && res.data?.code === 0,
    status: res.status,
    message: res.data?.message,
  };
};
