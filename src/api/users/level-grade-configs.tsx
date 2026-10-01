import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";

// Response types for /api/users/level-grade-configs
export interface LevelGradeConfigsResponse {
  code: number;
  data: {
    levels: number[];
    grades: Array<{
      gradeId: number;
      gradeName: string;
    }>;
  };
  message: string;
}

// API function
export const levelGradeConfigsAPI = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<LevelGradeConfigsResponse>>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR(
    token ? `/api/users/level-grade-configs` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute cache
    }
  );

  return { swr };
};

// Hook for easier usage
export const useLevelGradeConfigs = () => {
  const { swr } = levelGradeConfigsAPI();

  return {
    levels: swr.data?.data?.levels || [],
    grades: swr.data?.data?.grades || [],
    isLoading: swr.isLoading,
    error: swr.error,
    mutate: swr.mutate,
    code: swr.data?.code,
    message: swr.data?.message,
  };
};