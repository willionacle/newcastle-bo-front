import useUserStore from "@/store/user.store";
import instance from "../axios";
import { CreateFakeWithdrawalBody } from "./post";

export const updateFakeWithdrawal = async (
  id: string,
  body: CreateFakeWithdrawalBody
) => {
  const token = useUserStore.getState().token;

  return instance.put(
    "/fake-withdrawals/" + id,
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
