import useUserStore from "@/store/user.store";
import instance from "../axios";

export type SpecialGameStatus = "draft" | "open" | "closed" | "cancelled";

export const updateSpecialGameStatus = async (id: number, status: SpecialGameStatus) => {
  const { token } = useUserStore.getState();

  return instance.patch(
    `/api/special-games/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export type SpecialGameChoiceResult = "pending" | "win" | "lose" | "draw" | "cancelled";

export interface SettleSpecialGameResult {
  id: number;
  result: SpecialGameChoiceResult;
}

export interface SettleSpecialGameResponse {
  code: number;
  message: string;
  data: unknown;
  settlement: {
    settledBets: number;
    winners: number;
    payoutTotal: string;
  };
}

export const settleSpecialGame = async (id: number, results: SettleSpecialGameResult[]) => {
  const { token } = useUserStore.getState();

  return instance.patch<SettleSpecialGameResponse>(
    `/api/special-games/${id}/settle`,
    { results },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
