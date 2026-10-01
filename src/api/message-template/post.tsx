import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";

export interface MessageTemplateBody {
  id?: number;
  title: string;
  message: string;
}

export const createMessageTemplateAPI = async (body: MessageTemplateBody) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post<MessageTemplateBody, any>("/addmessagetemplate", {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/messagetemplatelist");
  }

  return res;
};
