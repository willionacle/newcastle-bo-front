import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import useQuery from "@/hooks/useQuery";
import { InquiryCategory } from "../inquiry/get";

// "*" means "every inquiry type" — same convention as category on the templates themselves.
export type InquiryTemplateCategory = InquiryCategory | "*";

export interface InquiryTemplate {
  id: number;
  category: InquiryTemplateCategory;
  title: string;
  content: string;
  sortOrder: number;
  isActive: boolean;
  useCount: number;
  lastUsedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// Same as InquiryTemplate, plus the fields the server fills in for one inquiry.
export interface InquiryTemplateRendered extends InquiryTemplate {
  rendered: string;
  unresolved: string[];
  placeholders: string[];
}

export interface InquiryTemplatesForInquiryRes {
  code: number;
  message: string;
  data: {
    inquiryId: number;
    category: string;
    username: string;
    // Already ordered by the server: this inquiry's own category first, then "*",
    // sortOrder within each, most-used first as a tiebreak. Do not re-sort.
    templates: InquiryTemplateRendered[];
  };
}

export const inquiryTemplatesForInquiryAPI = (inquiryId: number, token: string) => {
  return instance.get<undefined, AxiosResponse<InquiryTemplatesForInquiryRes>>(
    `/api/inquiry-templates/for-inquiry/${inquiryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export interface InquiryTemplateMetaCategory {
  key: string;
  labelKo: string;
}

export interface InquiryTemplateMetaPlaceholder {
  token: string;
  labelKo: string;
  description: string;
}

export interface InquiryTemplatesMetaRes {
  code: number;
  message: string;
  data: {
    anyCategory: string;
    categories: InquiryTemplateMetaCategory[];
    placeholders: InquiryTemplateMetaPlaceholder[];
  };
}

export const inquiryTemplatesMetaAPI = (token: string) => {
  return instance.get<undefined, AxiosResponse<InquiryTemplatesMetaRes>>(
    "/api/inquiry-templates/meta",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export interface InquiryTemplateListRes {
  code: number;
  message: string;
  data: InquiryTemplate[];
  page: number;
  totalitems: number;
  totalpage: number;
}

export const inquiryTemplatesListAPI = () => {
  const { token } = useUserStore.getState();
  const { onHeaderCell, query, setFilters, paginationProps } = useQuery({
    filter: {
      page: 1,
      limit: 50,
      orderby: "asc",
      columnby: "sort_order",
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<undefined, AxiosResponse<InquiryTemplateListRes>>(
      `${url}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const swr = useSWR([`/api/inquiry-templates`, query], fetcher);
  return { swr, onHeaderCell, setFilters, paginationProps };
};
