import useQuery from "@/hooks/useQuery";
import instance from "../axios";
import useUserStore from "@/store/user.store";
import useSWR from "swr";
import { User } from "../users/get";

export interface MileageData {
  adminId: string;
  amount: number;
  systemNote: string;
  type: string;
  type2: string;
  username: string;
  prevMileage: null | number;
}

export const mileageAPI = (username: User["username"] | undefined) => {
  console.log(username)
  const token = useUserStore.getState().token;
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery();

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/mileages`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};
