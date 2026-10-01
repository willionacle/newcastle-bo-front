import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";

export type InquiryCategory =
  | "general"
  | "deposit"
  | "withdrawal"
  | "bank_account"
  | "crypto_wallet"
  | "etc";

export type InquiryStatus = "pending" | "answered" | "closed";

export interface InquiryItem {
  id: number;
  username: string;
  category: InquiryCategory;
  title: string;
  content: string;
  status: InquiryStatus;
  answer: string | null;
  answeredBy: string | null;
  answeredAt: string | null;
  // The reply-template row the answer was sent from, if any (drives useCount / "most used first").
  answerTemplateId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryListRes {
  code: number;
  message: string;
  data: InquiryItem[];
  page: number;
  totalitems: number;
  totalpage: number;
}

export const inquiryListAPI = () => {
  const { token, userid } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      userid,
      page: 1,
      limit: 100,
      orderby: "desc",
      columnby: "created_at",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<InquiryListRes>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/api/inquiries/list`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
