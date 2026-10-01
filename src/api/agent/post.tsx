import useUserStore from "@/store/user.store";
import useSWR from "swr";
import instance from "../axios";
import { Strapi } from "../types/strapi";
import { mutate } from "swr";
export interface AgentAddDeductData {
  userid: number;
  username: string;
  admin_id: string;
  amount: number;
  system_note?: string;
}

export const findAgentAPI = (id: any) => {
  const { token, userid } = useUserStore.getState();

  const fetcher = async ([url, id]: [string, number]) => {
    const res = await instance.post(
      `${url}`,
      { userid, id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  };

  return useSWR([`/getuser`, id], id ? fetcher : null);
};

export const createAgent = async (data: any) => {
  const { token, userid } = useUserStore.getState();

  return await instance.post(
    "/addagent",
    { ...data, userid },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const adjustAgentBalance = async (
  body: AgentAddDeductData,
  id: Strapi["id"] | undefined
) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<AgentAddDeductData, any>(
    "/adddeductagentbalance",
    { ...body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res) {
    mutate(`/getuser?id=${id}`);
  }

  return res.data;
};
