import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery, { Option } from "@/hooks/useQuery";
import {
  TransactionRuleListRes,
  TransactionRuleMetaRes,
  TransactionRulePreviewRes,
  TransactionRuleRes,
} from "./types";

export const transactionRulesMetaAPI = (token: string) => {
  return instance.get<undefined, AxiosResponse<TransactionRuleMetaRes>>(
    "/api/transaction-rules/meta",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const transactionRulesListAPI = (params?: Option["filter"]) => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 100,
      orderby: "asc",
      columnby: "target_type",
      targetType: null,
      isActive: null,
      keyword: null,
      ...params,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<TransactionRuleListRes>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/api/transaction-rules`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};

export const transactionRuleAPI = (id: number, token: string) => {
  return instance.get<undefined, AxiosResponse<TransactionRuleRes>>(
    `/api/transaction-rules/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Conditional-key SWR — no fetch until a username is actually typed in.
export const transactionRulePreviewAPI = (username?: string) => {
  const { token } = useUserStore.getState();

  const fetcher = async ([url, username]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<TransactionRulePreviewRes>>(
      url,
      {
        params: { username },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  return useSWR(
    username ? [`/api/transaction-rules/preview`, username] : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
};
