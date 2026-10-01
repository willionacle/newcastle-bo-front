import useUserStore from "@/store/user.store";
import instance from "../axios";

export const deleteUVAccount = async (id: number) => {
  const {token, userid} = useUserStore.getState();

  return await instance.post(
    "/deletevirtualaccount/",
    { userid, id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
