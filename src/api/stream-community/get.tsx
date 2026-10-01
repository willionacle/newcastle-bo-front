import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery, { Option } from "@/hooks/useQuery";
import { SWRType } from "../types";
import useStateQuery from "@/hooks/useStateQuery";

export interface MatchData {
  id: number;
  MatchID: string;
  Channel: string;
  TimeStart: string;        
  UTCTimeStart: string;     
  TimeStop: string;      
  UTCTimeStop: string;     
  Name: string;
  Home: string;
  Away: string;
  HomeCH: string;
  AwayCH: string;
  HomeTH: string;
  AwayTH: string;
  HomeCHTW: string;
  AwayCHTW: string;
  Type: string;
  League: string;
  LeagueCH: string;
  LeagueTH: string;
  LeagueCHTW: string;
  NowPlaying: boolean;
  IsLive: boolean;
  State: string;       
  HomeScore: string;
  AwayScore: string;
  Hd: number;
  bid: string;
  bg: string;
  rb: string;
  UniqueID: string;
  is_on: boolean;
  streamlink?: string;
}

export interface CategoryData {
  id: number;
  category: string;
  display_name: string;
  is_visible: boolean;
}

export interface LeagueData {
  id: number;
  title: string;
  is_visible: boolean;
}

export interface BannedWordData {
  id: number;
  forbidden_word: string;
  is_allowed: boolean;
}

export type ChatUser = {
  user_id: number;
  name: string;
  real_name: string;
  grade: number;
  level: number;
  chat_level: number | null;
  is_allowed: boolean;
  is_delete_allowed: boolean;
  is_admin: boolean;
  last_chat: string;
};

export type ChatReply = {
  id: string;
  name: string;
  reply: string;
  reply_date: string;
};


export interface ScdCommentCount {
  daily_count: number;
  total_count: number;
}

interface ScdCommentCountResponse {
  code: number;
  message: string;
  data: ScdCommentCount;
}


export const streamcommunitylistApi = (params?: Option['filter']) => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "asc",
      columnby: "TimeStart",
      type: "",
      filter_matchid:null,
      filter_uniqueid:null,
      filter_channel:null,
      filter_type:null,
      filter_league:null,
      filter_state:null,
      filter_home:null,
      filter_away:null,
      filter_isLive:null,
      filter_nowPlay:null,
      filter_starttime:null,
      filter_endtime:null,
      filter_ison:1,
      ...params
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<MatchData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/streamcommunitylist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getStreamApi = async (id:number | undefined): Promise<MatchData> => {
  const { token,username } = useUserStore.getState();
  
  const res = await instance.get<undefined, AxiosResponse<SWRType<MatchData>>>(
    `/getstreamcommunitylist?id=${id}&username=${username}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  return res.data?.data;
};

export const getCategoriesApi = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      orderby:"asc",
      columnby:"category",
      filter_category:"",
      filter_isvisible:"",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<CategoryData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/getsccategorylist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getLeagueApi = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page:1,
      limit:50,
      orderby:"asc",
      columnby:"id",
      filter_title:"",
      filter_isvisible:"",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<LeagueData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/getscleaguelist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getChatWordsApi = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page:1,
      limit:100,
      orderby:"asc",
      columnby:"id",
      filter_forbiddenword:"",
      filter_isallowed:"",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<BannedWordData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/getscchatforbiddenwordslist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getChatUsersApi = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page:1,
      limit:100,
      orderby:"DESC",
      columnby:"comment_date",
      filter_userid:"",
      filter_name:"",
      filter_grade:"",
      filter_level:"",
      filter_chatlevel:"",
      filter_isallowed:"",
      filter_isadmin:"",
      filter_lastchat:"",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<ChatUser[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/getchatuserlist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
export const getChatRepliesApi = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page:1,
      limit:100,
      orderby:"DESC",
      columnby:"reply_date",
      filter_id:"",
      filter_name:"",
      filter_reply:"",
      filter_datefrom:"",
      filter_dateto:"",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<ChatReply[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/getscchatreplieslist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const getScdCommentCountApi = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<ScdCommentCountResponse>>(
      url,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  };

  const swr = useSWR(`/getscdcommentcount`, fetcher);
  return { swr };
};

export const userChatDetailsAPIStateQuery = (params?: Option['filter']) => {
  const {token} = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useStateQuery({
    filter: {
        page				: 1,
        limit				: 100,
        orderby     : 'DESC',
        columnby    : 'comment_date',
        filter_match_id      : null,
        filter_commentsearch  : null,
        filter_datefrom       : null,
        filter_dateto   : null,
        filter_name     : null,
        ...params
      }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<any>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/chatuserlist`, query], params?.filter_name ? fetcher : null);

  return { swr, onHeaderCell, setFilters, paginationProps };
};
