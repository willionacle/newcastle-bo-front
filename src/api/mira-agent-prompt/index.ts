import useSWR from "swr";
import { AxiosResponse } from "axios";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import {
  AgentPromptListResponse,
  AgentPromptApiResponse,
  UpdateAgentPromptBody,
  UpdateAgentPromptResponse,
} from "./types";

// 목록 조회
export const useAgentPromptList = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<AgentPromptListResponse>>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  const swr = useSWR("/api/mira/agent-prompt/list", fetcher);

  return { swr };
};

// 수정
export const updateAgentPrompt = async (body: UpdateAgentPromptBody) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.post<
      undefined,
      AxiosResponse<AgentPromptApiResponse<UpdateAgentPromptResponse>>
    >("/api/mira/agent-prompt/update", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
