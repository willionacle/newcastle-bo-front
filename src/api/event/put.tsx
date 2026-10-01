import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";

export const updateEventAPI = async (
  data: globalThis.FormData,
  id: number | undefined
) => {
  const token = useUserStore.getState().token;

  const res = await instance.put(`/events/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/events");
  }

  return res;
};
