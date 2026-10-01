import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { User } from "../users/get";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { NXAPI, SWRType } from "../types";

export interface RollingLog extends NXAPI {
  admin_id: string;
  amount: number;
  bet_amount: null | number;
  prev_rolling_point: null | number;
  rolling_percentage: null | number;
  system_note: string;
  record_type: string;
  type2: null | string;
  username: User["username"];
  vendor_key: null | string;
}

export const findRollingAPI = (username: User["username"] | undefined) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
        userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'id',
        username    : username,
        start_date  : null,
        end_date    : null,
        type        : null,
        system_note : null,
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    console.log(query)
    const res = await instance.get<undefined, AxiosResponse<SWRType<RollingLog[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/rollingpointlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
