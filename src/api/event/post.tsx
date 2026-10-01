import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";

export const createEventAPI = async (data: globalThis.FormData) => {
  const token = useUserStore.getState().token;

  const res = await instance.post("/events", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/events");
  }

  return res;
};
