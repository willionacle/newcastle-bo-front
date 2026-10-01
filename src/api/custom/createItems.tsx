import useUserStore from "@/store/user.store";
import instance from "../axios";
import { User } from "../users/get";
import { Strapi } from "../types/strapi";

interface Body {
  usernames: User["username"][];
  gameitemId: Strapi["id"];
  systemNote: string;
}

export const createItem = async (body: Body) => {
  const token = useUserStore.getState().token;

  return await instance.post("/custom/create-items", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
