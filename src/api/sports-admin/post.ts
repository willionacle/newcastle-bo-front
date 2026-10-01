import instance from "../axios";
import useUserStore from "@/store/user.store";
import { AxiosResponse } from "axios";
import { PostRes } from "../types";
import { SportsAdminBoard } from "./get";

export interface CloseGamePayload {
  board: SportsAdminBoard;
  gameId: string;
  closed: boolean;
  hidden?: boolean;
  reason?: string;
}

// Writes one all-wildcard override row — the "경기 마감" button.
export const closeGameAPI = (payload: CloseGamePayload) => {
  const { token } = useUserStore.getState();
  return instance.post<undefined, AxiosResponse<PostRes<{ id: number }>>>(
    "/api/sports-admin/overrides/close-game",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export interface ClearGamePayload {
  board: SportsAdminBoard;
  gameId: string;
}

// Deletes every override on that game, returning it to feed prices — "초기화".
export const clearGameAPI = (payload: ClearGamePayload) => {
  const { token } = useUserStore.getState();
  return instance.post<undefined, AxiosResponse<PostRes<unknown>>>(
    "/api/sports-admin/overrides/clear-game",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
