import useUserStore from "@/store/user.store";
import instance from "../axios"
import { BetBlockBody } from "./types";



export const createBetBlockAPI = async (
  body: BetBlockBody
) => {
  const token = useUserStore.getState().token;

  const res = await instance.post(
    `/api/bet-block/add`, 
    body, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
}