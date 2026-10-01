import useUserStore from "@/store/user.store";
import instance from "../axios";
import { SpecialGameChoiceInput } from "./post";

export interface UpdateSpecialGameBody {
  title?: string;
  category?: string;
  betStartAt?: string;
  betEndAt?: string;
  isVisible?: 0 | 1;
  displayOrder?: number;
  note?: string;
}

export const updateSpecialGame = async (id: number, body: UpdateSpecialGameBody) => {
  const { token } = useUserStore.getState();

  return instance.put(`/api/special-games/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Replaces all choices — the previous rows are deleted and reinserted with
// new ids, so callers must refetch the game afterward before settling.
export const updateSpecialGameChoices = async (id: number, choices: SpecialGameChoiceInput[]) => {
  const { token } = useUserStore.getState();

  return instance.put(
    `/api/special-games/${id}/choices`,
    { choices },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
