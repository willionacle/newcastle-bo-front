import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface RegulationData {
  id: number;
  title: string;
  content: string;
  status: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  update_by: string;
  content_type: string;
}

export const regulationAPI = () => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid: userid,
      page: 1,
      limit: 100,
      orderby: "asc",
      columnby: "id",
      type: "",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<RegulationData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/regulationlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
