import { Option } from "@/hooks/useQuery";
import useStateQuery from "@/hooks/useStateQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import { SWRType } from "../types";
import { BetBlockData } from "./types";

export const getBetBlockstAPI = (params?: Option['filter']) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useStateQuery({ 
    filter: {
      userid: userid,
      page: 1,
      limit: 100,
      orderby: 'desc',
      columnby: 'created_at',
      vendor_id: null,
      table_id: null,
      virtual_table_id: null,
      game_name: null,
      game_type: null,
      is_blocked: null,
      created_at: null,
      updated_at: null,
      ...params,
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<BetBlockData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/api/bet-block/list`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};