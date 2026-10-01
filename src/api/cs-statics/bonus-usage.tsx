import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";
import { NXAPI, SWRType } from "../types";

export interface BonusUsageData extends NXAPI {
  bonus_name: string;
  bonus_amount: number;
  deposit_amount: number;
  bonus_count_application: number;
  bonus_count_used: number;
}

export const bonusUsageStatistics = () => {
  const { userid, token } = useUserStore.getState()

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
      userid,
      page: 1,
      limit: 5000,
      orderby: 'asc',
      columnby: 'bonus_name',
      bonus_name: null,
      agent_id: null,
      start_date: null,
      end_date: null,
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<BonusUsageData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  const swr = useSWR([`/bonus-usage`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps, query };
};
