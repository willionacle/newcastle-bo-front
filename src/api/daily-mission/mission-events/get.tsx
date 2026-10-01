import useUserStore from "@/store/user.store";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { NXAPI, SWRType, User } from "@/api/types";
import instance from "@/api/axios";
import { MissionGroupData } from "../get";
import { MissionCouponItem } from "../mission-coupon/get";

export interface MissionItemData {
  id: number;
  mission_id: MissionCouponItem['id'];
  mission_name: MissionCouponItem['name'];
  mission_type: MissionCouponItem['mission_type'];
  percentage: MissionCouponItem['percentage'];
  amount: MissionCouponItem['amount'];
  target_amount: number;
  status: number;
  type: number;
}

export interface MissionEventsData extends Partial<NXAPI> {
  username: User['username']
  mission_group: MissionGroupData['name'];
  mission_perion: string;
  mission_percentage: MissionCouponItem['percentage'];
  mission_items: MissionItemData[];
}

export const getDailyMissionEventsListAPI = () => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 50,
      "orderby"       : "desc",
      "columnby"      : "id",
      "username"      : null,
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MissionEventsData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/missioneventlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};