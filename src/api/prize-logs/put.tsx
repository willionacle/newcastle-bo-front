import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";
import { PrizeLogsData } from "./get";

export const updatePrizeLogs = async (
  id: Strapi["id"],
  status: PrizeLogsData["status"]
) => {
  const token = useUserStore.getState().token;

  return await instance.put(
    `/prize-logs/${id}`,
    {
      data: {
        status,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token} `,
      },
    }
  );
};
