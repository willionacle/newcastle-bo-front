import useUserStore from "@/store/user.store";
import instance from "../axios";
import { Strapi } from "../types/strapi";
import { mutate } from "swr";

export const deleteEvents = async (id: Strapi["id"]) => {
  const token = useUserStore.getState().token;

  const res = await instance.delete(`/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/events");
  }

  return res;
};
