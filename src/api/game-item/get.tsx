import useUserStore from "@/store/user.store";
import instance from "../axios";
import useQuery from "@/hooks/useQuery";
import useSWR from "swr";
import { Strapi, StrapiImg, StrapiRes } from "../types/strapi";
import { AxiosResponse } from "axios";
import { stringify } from "qs";

export type ItemCategoryType = "COUPON" | "LUCKYWHEEL" | "ADVANTAGE" | "PRIZE";

export interface GameItemData extends Strapi {
  couponAmount: null | number;
  discount: number;
  discountedPrice: number;
  displayPX: boolean;
  displaySpecialStore: boolean;
  duration: string | null;
  expiredDate: null | string;
  itemCategory: ItemCategoryType;
  itemName: string;
  plusLossingPercentage: null | number;
  plusRollingPercentage: null | number;
  regularPrice: number;
  image: StrapiImg;
  description: null | string;
}

export const gameItemAPI = () => {
  const token = useUserStore.getState().token;
  const { onHeaderCell, paginationProps, query, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<GameItemData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/gameitems", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};

export const findGameItemAPI = (id: string | undefined) => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const query = stringify(
      {
        populate: "*",
      },
      {
        encodeValuesOnly: true,
      }
    );

    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<GameItemData>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  return useSWR(`/gameitems/${id}`, id ? fetcher : null);
};
