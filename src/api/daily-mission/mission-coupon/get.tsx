import useUserStore from "@/store/user.store";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import instance from "@/api/axios";
import { SWRType } from "@/api/types";
import { MissionCouponGroupItem } from "@/pages/event/daily-mission-group/MissionGroupForm";
import useQuery from "@/hooks/useQuery";

export interface MissionCouponItem {
    id?: number | undefined;
    name?: string;
    is_active?: number | undefined;
    function_name?: string | undefined;
    percentage?: number;
    amount?: number;
    mission_type?: string | undefined;
    coupon_name?: string | undefined;
    coupon_percentage?: number;
    is_used?: number | undefined;
}


export const getMissionCouponNameListAPI = (type: MissionCouponGroupItem['item_type']) => {
  const {token, userid} = useUserStore.getState()

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MissionCouponGroupItem[]>>>(
      `${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR(`/missioncouponlist?userid=${userid}&item_type=${type}&is_active=1`, type ? fetcher : null, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  return { swr};
};

export const getDailyMissioCouponListAPI = (type: MissionCouponGroupItem['item_type']) => {
    const {token, userid} = useUserStore.getState();
    const fetchURL = type === 'mission' ? '/missionlist' : '/couponmissionlist';
    // const itemType = type === 'mission' ? 'mission' : undefined

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
        "mission_type"    : type !== "mission" ? undefined : null
      }
    });
  
    const fetcher = async ([url, query]: [string, string]) => {
      const res = await instance.get<undefined, AxiosResponse<SWRType<MissionCouponItem[]>>>(
        `${url}?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return res.data;
    };
  
    const swr = useSWR([fetchURL, query], type ? fetcher : null);
    return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getDailyMissioCouponAPI = (type: MissionCouponGroupItem['item_type'], id: MissionCouponItem['id']) => {
    const {token, userid} = useUserStore.getState();
    const fetchURL = type === 'mission' ? '/getmission' : '/getmissioncoupon';
  
    const fetcher = async (url: string) => {
      const res = await instance.get<undefined, AxiosResponse<SWRType<MissionCouponItem>>>(
        `${url}?userid=${userid}&id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return res.data;
    };
  
    const swr = useSWR(fetchURL, type ? fetcher : null);
    return { swr };
};