import useQuery from "@/hooks/useQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { Strapi, StrapiRes } from "../types/strapi";
import { User } from "../users/get";

export interface FakeWithdrawalData extends Strapi {
  username: User["username"];
  amount: number;
}

export const fakeWithdrawalAPI = () => {
  const token = useUserStore.getState().token;
  const { query, onHeaderCell, paginationProps, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<FakeWithdrawalData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/fake-withdrawals", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};

export const findFakeWithdrawalAPI = (id: string | undefined) => {
  const token = useUserStore.getState().token;

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<StrapiRes<FakeWithdrawalData>>
    >(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return useSWR("/fake-withdrawals/" + id, id ? fetcher : null);
};
