import useSWR from "swr";
import { AxiosResponse } from "axios";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import useQuery from "@/hooks/useQuery";
import {
  KnowledgeListResponse,
  KnowledgeApiResponse,
  CreateKnowledgeBody,
  UpdateKnowledgeBody,
  DeleteKnowledgeBody,
  CreateKnowledgeResponse,
  UpdateKnowledgeResponse,
  DeleteKnowledgeResponse,
} from "./types";

// 목록 조회
export const useKnowledgeList = () => {
  const { token } = useUserStore.getState();
  const { query, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 20,
      orderby: "desc",
      columnby: "Id",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<KnowledgeListResponse>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  const swr = useSWR(["/api/mira/knowledge/list", query], fetcher);

  return { swr, paginationProps };
};

// 생성
export const createKnowledge = async (body: CreateKnowledgeBody) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.post<
      undefined,
      AxiosResponse<KnowledgeApiResponse<CreateKnowledgeResponse>>
    >("/api/mira/knowledge/create", body, {
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

// 수정
export const updateKnowledge = async (body: UpdateKnowledgeBody) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.post<
      undefined,
      AxiosResponse<KnowledgeApiResponse<UpdateKnowledgeResponse>>
    >("/api/mira/knowledge/update", body, {
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

// 삭제
export const deleteKnowledge = async (body: DeleteKnowledgeBody) => {
  const { token } = useUserStore.getState();

  try {
    const res = await instance.post<
      undefined,
      AxiosResponse<KnowledgeApiResponse<DeleteKnowledgeResponse>>
    >("/api/mira/knowledge/delete", body, {
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
