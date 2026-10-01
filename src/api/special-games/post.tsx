import useUserStore from "@/store/user.store";
import instance from "../axios";

export interface SpecialGameChoiceInput {
  label: string;
  odds: number;
  displayOrder?: number;
}

export interface CreateSpecialGameBody {
  title: string;
  choices: SpecialGameChoiceInput[];
  category?: string;
  betStartAt?: string;
  betEndAt?: string;
  status?: "draft" | "open" | "closed";
  isVisible?: 0 | 1;
  displayOrder?: number;
  note?: string;
}

export const createSpecialGame = async (body: CreateSpecialGameBody) => {
  const { token } = useUserStore.getState();

  return instance.post("/api/special-games", body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
