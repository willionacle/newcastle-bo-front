import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";

export const userLevelUpLog = () => {
  const {token, userid} = useUserStore.getState();

  const { onHeaderCell, query, setFilters, paginationProps } = useQuery(
    { filter: {
      userid,
      page: 1,
      limit: 100,
      orderby: 'desc',
      columnby: 'log_id',
      user_real_name: null,
      username: null,
      agent_id: null,
      }
    }
  );

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data
  };

  const swr = useSWR(["/userlevellist", query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps }
};
