import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import useQuery from "@/hooks/useQuery";

export const findAgentAPI = (filter?: object | undefined) => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid: userid,
      page: 1,
      limit: 9999,
      columnby: "id",
      orderby: "desc",
      user_status: "",
      username: "",
      user_real_name: "",
      user_level: "",
      start_date: null,
      end_date: null,
      ...filter,
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

  const swr = useSWR([`/agent/list`, query], fetcher);

  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const agentListAPI = () => {
  const { token } = useUserStore.getState();

  const fetcher = async ([url]: [string]) => {
    const res = await instance.get(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR([`/agent/list`], fetcher);

  return { swr };
};
