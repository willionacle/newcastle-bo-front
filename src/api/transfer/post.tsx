import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";

export interface CashInOutBody {
  username: string;
  type: "out" | "out";
  amount: number;
}

export const cashInOut = async (body: CashInOutBody) => {
  const id = window.location.pathname.split("/").pop();
  const { token, username } = useUserStore.getState();

  const res = await instance.post<Body, any>(
    "/transfer/evo_tran/cashinout",
    { ...body,adminid: username },
    {
      baseURL: import.meta.env.VITE_GAMEAPI_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res) {
    mutate(`/getuser?id=${id}`);
  }

  return res;
};
