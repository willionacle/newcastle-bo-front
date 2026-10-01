import useUserStore from "@/store/user.store";
import instance from "../axios";
import { mutate } from "swr";
import { User } from "../users/get";

// {
//   "group": "online", // 또는 숫자, 또는 null
//   "messageTitle": "새 메시지 제목",
//   "messageBody": "새 메시지 본문",
//   "receiver": [] // group이 null일 때만 사용됩니다.
//   "status": group이 status일 때만 사용
// }

export interface CreateMessageBody {
  group: "online" | "status" | number | null;
  receivers?: string[];
  messageTitle: string;
  messageBody: string;
  status?: User["status"];
}

export const createMessageAPI = async (body: CreateMessageBody) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<CreateMessageBody, any>("/messages", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res) {
    mutate("/messages");
  }

  return res;
};
