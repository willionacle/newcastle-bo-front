import useUserStore from "@/store/user.store";
import instance from "../axios";

export const deleteFakeWithdrawal = async (id: string) => {
  const token = useUserStore.getState().token;

  return instance.delete("/fake-withdrawals/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
