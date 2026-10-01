import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";
import { LevelAccountData } from "./get";

interface Body {
  bank_name: LevelAccountData["bank_name"];
  account_number: LevelAccountData["account_number"];
  account_name: LevelAccountData["account_name"];
}

export const updateLevelAccount = async (id: Strapi["id"], body: Body) => {
  const token = useUserStore.getState().token;

  return await instance.put(
    "/level-accounts/" + id,
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
