import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";

// Response types for /api/users/search-usernames
export interface SearchUsernamesResponse {
  code: number;
  data: Array<{
    username: string;
    userLevel: number;
    userGrade: number;
  }>;
  message: string;
}

export interface SearchUsernamesParams {
  username?: string | null;
  user_level?: number[] | string | null;
  user_grade?: number[] | string | null;
}

// API function
export const searchUsernamesAPI = (params?: SearchUsernamesParams) => {
  const { token } = useUserStore.getState();

  const fetcher = async ([url, searchParams]: [string, SearchUsernamesParams | undefined]) => {
    const queryParams = new URLSearchParams();

    // Add username parameter if provided
    if (searchParams?.username !== undefined && searchParams.username !== null) {
      queryParams.append('username', searchParams.username);
    }

    // Add user_level parameter if provided (convert array to comma-separated string)
    if (searchParams?.user_level !== undefined && searchParams.user_level !== null) {
      const levelString = Array.isArray(searchParams.user_level)
        ? searchParams.user_level.join(',')
        : searchParams.user_level.toString();
      queryParams.append('user_level', levelString);
    }

    // Add user_grade parameter if provided (convert array to comma-separated string)
    if (searchParams?.user_grade !== undefined && searchParams.user_grade !== null) {
      const gradeString = Array.isArray(searchParams.user_grade)
        ? searchParams.user_grade.join(',')
        : searchParams.user_grade.toString();
      queryParams.append('user_grade', gradeString);
    }

    const queryString = queryParams.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    const res = await instance.get<undefined, AxiosResponse<SearchUsernamesResponse>>(
      finalUrl,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR(
    token ? [`/api/users/search-usernames`, params] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  );

  return { swr };
};

// Hook for easier usage
export const useSearchUsernames = (params?: SearchUsernamesParams) => {
  const { swr } = searchUsernamesAPI(params);

  return {
    data: swr.data?.data || [],
    isLoading: swr.isLoading,
    error: swr.error,
    mutate: swr.mutate,
    code: swr.data?.code,
    message: swr.data?.message,
  };
};