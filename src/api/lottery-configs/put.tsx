import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";
import { LotteryConfigData } from "./get";

interface UpdateLotteryBody {
  cnt: LotteryConfigData["cnt"];
  amount: LotteryConfigData["amount"];
  percentage: LotteryConfigData["percentage"];
}

export const updateLotteryConfigAPI = async (
  id: Strapi["id"],
  body: UpdateLotteryBody
) => {
  const token = useUserStore.getState().token;

  return await instance.put<UpdateLotteryBody, any>(
    `/lottery-configs/${id}`,
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
