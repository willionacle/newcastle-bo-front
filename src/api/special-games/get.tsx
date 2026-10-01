import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface SpecialGameChoice {
  id: number;
  specialGameId: number;
  label: string;
  odds: number;
  displayOrder: number;
  result: "pending" | "win" | "lose" | "draw" | "cancelled";
  isActive: boolean;
}

export interface SpecialGameData {
  id: number;
  title: string;
  category: string | null;
  betStartAt: string | null;
  betEndAt: string | null;
  status: "draft" | "open" | "closed" | "settled" | "cancelled";
  isVisible: boolean;
  displayOrder: number;
  note: string | null;
  settledAt: string | null;
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
  choices: SpecialGameChoice[];
}

export const specialGamesListAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 20,
      orderby: "desc",
      status: undefined,
      category: undefined,
      keyword: undefined,
      isVisible: undefined,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<SpecialGameData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/api/special-games`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export interface SpecialGameSingleResponse {
  code: number;
  message: string;
  data: SpecialGameData;
}

export const findSpecialGameAPI = (id: string | undefined) => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SpecialGameSingleResponse>>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  return useSWR(id ? `/api/special-games/${id}` : null, id ? fetcher : null);
};
