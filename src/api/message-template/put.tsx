import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";
import { MessageTemplateBody } from "./post";

export const editMessageTemplateAPI = async (body: MessageTemplateBody) => {
  const {token, userid} = useUserStore.getState();

  const res = await instance.post<MessageTemplateBody, any>("/editmessagetemplate", {...body, userid}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/messagetemplatelist");
  }

  return res;
};
