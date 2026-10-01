import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { SWRType } from "../types";

export interface EventItem {
  id: number;
  Title: string;
  Contents: string;
  MatchID: number;
  Time: string;      
  StartDate: string; 
  EndDate: string;   
  League: string;
  HomeTeam: string;
  AwayTeam: string;
  Type: string;     
  NowPlaying: boolean;
  IsLive: boolean;
  IsVisible: boolean;
}

export const getSceventListApi = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 50,
      orderby: "asc",
      columnby: "Time",
      filter_matchid: "",
      filter_league: "",
      filter_hometeam: "",
      filter_awayteam: "",
      filter_type: "",
      filter_isLive: "",
      filter_nowPlay: "",
      filter_isVisible: "",
      filter_startdate: "",
      filter_enddate: "",
      filter_time: "",
      title: "",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<EventItem[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/getsceventlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getSceventApi = async (id:string | undefined): Promise<EventItem> => {
  const { token } = useUserStore.getState();
  
  const res = await instance.get<undefined, AxiosResponse<SWRType<EventItem>>>(
    `/getscevent?match_id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  return res.data?.data;
};
