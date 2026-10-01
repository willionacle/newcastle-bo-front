import useUserStore from "@/store/user.store";
import instance from "../axios";
import { GameMaintenanceData } from "./get";
import { Strapi } from "../types/strapi";

interface Body {
  is_maintenance: GameMaintenanceData["is_maintenance"];
}

export interface UpdateGameImageBody {
  "id"                : GameMaintenanceData['id'];
  "game_image"        ?: string; //optional
  "game_image_mobile" ?: string; //optional
}
export interface UpdateGameOrderBody {
  "id"            : GameMaintenanceData['id'];
  "id2"           : GameMaintenanceData['id'];
  "display_order" : GameMaintenanceData['display_order'];
}

export const updateMaintenanceAPI = async (body: Body, id: Strapi["id"]) => {
  const token = useUserStore.getState().token;

  return await instance.put(
    `game-lists/${id}`,
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateGameImage = async (body: UpdateGameImageBody) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post(
    `updategameimage`,
    { ...body, userid },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateGameOrder = async (body: UpdateGameOrderBody) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post(
    `updategameorder`,
    { ...body, userid },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
