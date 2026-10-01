import useUserStore from "@/store/user.store";
import instance from "../axios";

export interface DepositBonusV2Body {
  bonusName: string;
  bonusPercentage: number;
  minDeposit: number;
  maxAmount: number;
  withdrawalRolling: number;
  availableLevels: number[];
  availableGrades: number[];
  bonusType: 0 | 1 | 2;
  inUse: 0 | 1;
  tempOrder: number;
  dailyLimit: number | null;
  systemNote: string | null;
  bonusGroup: string;
  // See DepositBonusV2Data.isWelcome (get.tsx) — omitted/false means this is
  // a regular (non-welcome) bonus, so existing bonuses keep working untouched.
  isWelcome?: boolean;
  // 제외 회원 아이디 (최대 1,000명). 생략 = 변경 없음, null 또는 [] = 비움.
  excludedUsernames?: string[] | null;
}

export const createDepositBonusV2 = async (body: DepositBonusV2Body) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<DepositBonusV2Body, any>(
    "/api/deposit-bonus",
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
