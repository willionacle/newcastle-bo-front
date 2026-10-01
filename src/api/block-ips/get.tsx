import useQuery from "@/hooks/useQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import { BlockReasonCode, NXAPI, SWRType } from "../types";

export interface BlockIpsData extends NXAPI {
  ip: string;
  system_note: string;
  reason_code?: BlockReasonCode;
  blocked_by?: string | null;
  username?: string | null;
  expires_at?: string | null;
}

export const blockIpsAPI = () => {
  const {token, userid} = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "desc",
      "columnby"      : 'id',
      "ip"            : null,
      "start_date"    : null,
      "end_date"      : null,
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<BlockIpsData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/blockiplist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters };
};
