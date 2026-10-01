import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { User } from "../users/get";

export const findAllSubAgents = (username: User["username"]) => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.post(
      url,
      { username },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  };

  return useSWR("/custom/findAllSubAgents", fetcher);
};
