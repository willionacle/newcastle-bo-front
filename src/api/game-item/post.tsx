import useUserStore from "@/store/user.store";
import instance from "../axios";

export const createGameItem = async (body: any) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<any, any>("/gameitems", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
