import useUserStore from "@/store/user.store";
import instance from "../axios";
import { DepositBonusesData } from "./get";

export interface DepositBonuseBody {
  bonusName: DepositBonusesData["bonusName"];
  bonusPercentage: DepositBonusesData["bonusPercentage"];
  minDeposit: DepositBonusesData["minDeposit"];
  maxAmount: DepositBonusesData["maxAmount"];
  withdrawalRolling: DepositBonusesData["withdrawalRolling"];
  availableLevel: DepositBonusesData["availableLevel"];
  inUse: DepositBonusesData["inUse"];
  tempOrder: DepositBonusesData["tempOrder"];
  dailyLimit: DepositBonusesData["dailyLimit"];
  systemNote: DepositBonusesData["systemNote"];
}

export const createDepositBonuse = async (body: {
  data: DepositBonuseBody;
}) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<DepositBonuseBody, any>(
    "/deposit-bonuses",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};
