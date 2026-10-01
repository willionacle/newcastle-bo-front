import useUserStore from "@/store/user.store";
import instance from "../axios"
import { BetBlockPatchParams } from "./types";



export const deleteBetBlockAPI = async (
  params: BetBlockPatchParams, 
) => {
  const token = useUserStore.getState().token;

  const res = await instance.delete(
    `/api/bet-block/${params.vender_id}/${params.table_id}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
}