import { api } from "../axios";
import useUserStore from "@/store/user.store";

export interface SearchGamesParams {
  q?: string;
  category?: string;
  vendor_id?: string;
  limit?: number;
  username?: string;
}

export interface GameItem {
  id: number;
  game_name: string;
  game_name_en: string;
  game_key: string;
  vendor_id: string;
  game_category: string;
  provider: string;
  is_hidden?: 0 | 1 | boolean; // 백엔드에서 반환하는 숨김 여부 (boolean 또는 숫자)
}

export interface SearchGamesResponse {
  code: number;
  data: GameItem[];
}

export const searchGamesAPI = async (params: SearchGamesParams): Promise<SearchGamesResponse> => {
  const { token } = useUserStore.getState();
  const response = await api.searchGames(params, token);
  return response.data;
};

export interface HiddenGameItem extends GameItem {
  is_hidden: 0 | 1;
  display_order: number | null;
  updated_at: string;
}

export interface UserHiddenGamesResponse {
  code: number;
  data: HiddenGameItem[];
}

export const getUserHiddenGamesAPI = async (userId: number): Promise<UserHiddenGamesResponse> => {
  const { token } = useUserStore.getState();
  const response = await api.getUserHiddenGames({ user_id: userId }, token);
  return response.data;
};