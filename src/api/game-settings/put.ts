import { api } from "../axios";
import useUserStore from "@/store/user.store";

export interface UpsertGameSettingsParams {
  user_id: number;
  game_id: number;
  is_hidden?: 0 | 1;
  display_order?: number | null;
}

export interface UpsertGameSettingsResponse {
  code: number;
  message: string;
}

export const upsertGameSettingsAPI = async (params: UpsertGameSettingsParams): Promise<UpsertGameSettingsResponse> => {
  const { token } = useUserStore.getState();
  const response = await api.upsertGameSettings(params, token);
  return response.data;
};