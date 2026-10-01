import useQuery from "@/hooks/useQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";
import { SWRType } from "../types";
import useSWR from "swr";
import dayjs from "dayjs";
import { stringify } from "qs";

export interface SportsMarketData {
  sportsName: string;                
  leagueName: string;               
  eventName?: string;               
  matchName: string;                 
  homeName: string;                  
  awayName: string;                  
  matchDateTime: string;            
  matchType: string;                 
  
  opened_homeBetSum: string;
  opened_homeWinSum: string;
  opened_drawBetSum: string;
  opened_drawWinSum: string;
  opened_awayBetSum: string;
  opened_awayWinSum: string;
  opened_betSum: string;
  opened_winSum: string;
  opened_betCount: number;

  settled_homeBetSum: string;
  settled_homeWinSum: string;
  settled_drawBetSum: string;
  settled_drawWinSum: string;
  settled_awayBetSum: string;
  settled_awayWinSum: string;
  settled_betSum: string;
  settled_winSum: string;
  settled_betCount: number;

  betSum: string;
  winSum: string;
  matchStatus: "Finished" | "Waiting" | "On-Going";               
  score: string;                     
  userName: string;
}

export interface MarketDetails {
  agent_username: string;          
  user_username: string;           
  eventName: string;               
  bettingName: string;             
  odds: string;                    
  betAmount: string;               
  expectedWinAmount: string;       
  winAmount: string;               
  status: "Opened" | "Lost" | "Won" | "Canceled" | "Cashout" | "Half Lost" | "Half Won" | string; 
  score: string;                   
  bettingScore: string;            
}

export interface MarketEventDetails {
  sportsName: string;
  leagueName: string;
  matchName: string;
  homeName: string;
  awayName: string;
  matchDateTime: string;
  matchType: string;
  eventName: string;
  bettingName: string;
  betAmount: string;
  expectedWinAmount: string;
  winAmount: string;
  odds: string;
  status: string;
}


export const sportsMarketAPI = (defaultFilter?: Record<string, any>) => {
  console.log("DEFAULT FILTER", defaultFilter)
  const { token } = useUserStore.getState();
  const { query, paginationProps, onHeaderCell, setFilters } = useQuery(
    {
      filter: {
        // userid      : userid,
        page				: 1,
        limit				: 100,
        orderby     : 'desc',
        columnby    : 'betSum',
        filter_agentid : null,
        filter_username : defaultFilter?.username || null,
        filter_islive   : null,
        filter_amount   : null,
        filter_status   : null,
        filter_match_status   : null,
        filter_startdate: dayjs().tz().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        filter_enddate  : dayjs().tz().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      },
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<SportsMarketData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/sportsmarketlist`, query], fetcher);

  return { swr, paginationProps, onHeaderCell, setFilters, query };
};

export const sportsMarketDetailsAPI = (filter: Record<string, any>) => {
  const { token } = useUserStore.getState();
  const query = stringify(filter);

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MarketDetails[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR([`/sportsmarketlistdetails`, query], fetcher);
};

export const sportsMarketEventAPI = (filter: Record<string, any>) => {
  const { token } = useUserStore.getState();
  const query = stringify(filter);

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<SportsMarketData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  const swr = useSWR([`/sportsmarketeventlist`, query], fetcher);

  return { swr }
};

export const sportsMarketEventDetailsAPI = (filter: Record<string, any>) => {
  const { token } = useUserStore.getState();
  const query = stringify(filter);

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MarketEventDetails[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR([`/sportsmarketeventlistdetails`, query], fetcher);
};