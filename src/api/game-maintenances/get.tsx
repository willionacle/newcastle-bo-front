import useQuery from "@/hooks/useQuery";
import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { SWRType } from "../types";

export interface GameMaintenanceData {
  id: number,
  vendor_id: string;
  vendor_name: string;
  game_category: string;
  game_key: string;
  game_name: string | null;
  game_name_en: string;
  game_image: string;
  game_image_mobile: string;
  is_maintenance: boolean;
  is_hidden: boolean;
  provider: string;
  roomId: string | null;
  display_order: number | null;
}

export interface GameListBody {
  vendor_id?: string;
  game_category?: string;
}

export const GameMaintenancesAPI = (gameCat?: string) => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "asc",
      "vendor_name"   : "",
      "game_name_en"  : "",
      "columnby"      : 'id',
      "vendor_id"     : '',
      "game_category" : gameCat ?? 'sports-lobby'
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<GameMaintenanceData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/gamelist`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const GameListAPI = ({vendor_id, game_category}: GameListBody) => {
  const {token, userid} = useUserStore.getState()
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      "userid"        : userid,
      "page"          : 1,
      "limit"         : 100,
      "orderby"       : "asc",
      "columnby"      : 'id',
      "game_name"     : "",
      "vendor_id"     : vendor_id,
      "game_category" : game_category
    }
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<GameMaintenanceData[]>>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/gamelistshow`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
