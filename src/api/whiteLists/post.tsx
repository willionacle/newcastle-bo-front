import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";

export const createWhiteList = async (body: object) => {
  const token = useUserStore.getState().token;

  const res = await instance.post("/white-lists", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/whtie-lists");
  }

  return res;
};
