import useQuery from "@/hooks/useQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { Strapi, StrapiRes } from "../types/strapi";
import { User } from "../users/get";
import { AxiosResponse } from "axios";
import { GameItemData } from "../game-item/get";

export interface ItemSaleData extends Strapi {
  userLevel: number;
  sendTime: string;
  cancel: boolean;
  isUsed: boolean;
  expiredDate: null | string;
  systemNote: string;
  username: null | User["username"];
  gameitem: GameItemData;
}

export const itemSaleAPI = () => {
  const token = useUserStore.getState().token;
  const { query, onHeaderCell, paginationProps, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<ItemSaleData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/item-sales", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};

export const findItemSaleAPI = (username: User["username"] | undefined) => {
  const token = useUserStore.getState().token;
  console.log(username)
  const { query, onHeaderCell, paginationProps, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<ItemSaleData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/item-sales", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};

export const findAdminItemSaleAPI = () => {
  const token = useUserStore.getState().token;
  const { query, onHeaderCell, paginationProps, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<ItemSaleData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/item-sales", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};
