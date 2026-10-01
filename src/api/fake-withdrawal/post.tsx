import useUserStore from "@/store/user.store";
import instance from "../axios";
import { User } from "../users/get";

export interface CreateFakeWithdrawalBody {
  username: User["username"];
  amount: number;
}

export const createFakeWithdrawal = async (body: CreateFakeWithdrawalBody) => {
  const token = useUserStore.getState().token;

  return instance.post(
    "/fake-withdrawals",
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
