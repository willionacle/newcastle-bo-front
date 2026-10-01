import instance from "../axios";
import useUserStore from "@/store/user.store";
import { AxiosResponse } from "axios";
import { PostRes } from "../types";

export const deleteOverrideAPI = (id: number) => {
  const { token } = useUserStore.getState();
  return instance.delete<undefined, AxiosResponse<PostRes<unknown>>>(
    `/api/sports-admin/overrides/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Falls back to the "*" rule.
export const deleteComboRuleAPI = (id: number) => {
  const { token } = useUserStore.getState();
  return instance.delete<undefined, AxiosResponse<PostRes<unknown>>>(
    `/api/sports-admin/combo-rules/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
