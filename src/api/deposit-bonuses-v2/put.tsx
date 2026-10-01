import useUserStore from "@/store/user.store";
import instance from "../axios";
import { DepositBonusV2Body } from "./post";

export const updateDepositBonusV2 = async (id: number, body: DepositBonusV2Body) => {
  const token = useUserStore.getState().token;

  const res = await instance.put<DepositBonusV2Body, any>(
    `/api/deposit-bonus/${id}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res;
};
