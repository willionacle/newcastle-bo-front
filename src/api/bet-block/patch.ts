import useUserStore from "@/store/user.store";
import instance from "../axios"
import { BetBlockPatchBody, BetBlockPatchParams } from "./types";



export const patchBetBlockAPI = async (
  params: BetBlockPatchParams, 
  body: BetBlockPatchBody
) => {
  const token = useUserStore.getState().token;

  const res = await instance.patch(
    `/api/bet-block/${params.vender_id}/${params.table_id}/is-blocked`, 
    body, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
}