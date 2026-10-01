import useUserStore from "@/store/user.store";
import instance from "../axios"
import { BetBlockBody } from "./types";

export const updateBetBlockAPI = async (
  body: BetBlockBody
) => {
  const token = useUserStore.getState().token;

  const res = await instance.put(
    `/api/bet-block/edit`, 
    body, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
}