import useUserStore from "@/store/user.store";
import instance from "../axios";

export const createDepositAccountAPI = async (body: any) => {
  const token = useUserStore.getState().token;

  return await instance.post(
    "/deposit-accounts",
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
