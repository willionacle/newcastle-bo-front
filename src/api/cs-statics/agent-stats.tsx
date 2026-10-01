import useUserStore from "@/store/user.store";
import instance from "../axios";
import useQuery from "@/hooks/useQuery";
import useSWR from "swr";

export const agentStatsAPI = (agent: string | undefined) => {
  const {token, userid} = useUserStore.getState();
  const { query, paginationProps, setFilters, onHeaderCell } = useQuery({
    filter: {
      userid,
      username: agent,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "username",
      start_date: null,
      end_date: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  return {
    swr: useSWR(["/compressedbyagentdaily", query], fetcher),
    query,
    paginationProps,
    setFilters,
    onHeaderCell
  };
};

export const agentPeriodStatsAPI = () => {
  const {token, userid} = useUserStore.getState();
  const { query, paginationProps, setFilters, onHeaderCell } = useQuery({
    filter: {
      userid,
      page: 1,
      limit: 5000,
      orderby: "asc",
      columnby: "agent_username",
      username: null,
      user_real_name: null,
      tree_depth: null,
      start_date: null,
      end_date: null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return {
    swr: useSWR(["/compressedbyagent", query], fetcher),
    query,
    paginationProps,
    setFilters,
    onHeaderCell
  };
};