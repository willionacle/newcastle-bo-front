import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { NXAPI, SWRType } from "../types";

export interface MissionData extends NXAPI {
  name: string;
  is_active: boolean;
  function_name: string;
  user_level: number;
  time_limit_hours: number;
  percentage: number;
  amount: number;
}

export interface MissionGroupData extends NXAPI {
  name: string;
  starthours: string;
  endhours: string;
  count: number;
  missions: string;
  mission_percentage: number;
  status: number
}

export const getDailyMissionGroupListAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "asc",
      "columnby"      : "id",
      "name"          : null,
      // "user_level"    : null,
      "is_active"     : null,
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MissionGroupData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/missiongrouplist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getMissionGroupAPI = (id?: string) => {
  const {token, userid} = useUserStore.getState()

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MissionGroupData>>>(
      `${url}?userid=${userid}&id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  };

  const swr = useSWR(`/getmissiongroup`, fetcher);
  return { swr };
};