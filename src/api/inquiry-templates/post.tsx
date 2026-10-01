import instance from "../axios";
import { AxiosResponse } from "axios";
import { InquiryTemplate } from "./get";

// category omitted / "" / "*" all mean "every inquiry type" on the server.
// Kept as a plain string rather than InquiryTemplateCategory: valid keys come
// dynamically from GET /meta, not a hardcoded FE union.
export interface InquiryTemplateBody {
  category?: string;
  title: string;
  content: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface InquiryTemplateRes {
  code: number;
  message: string;
  data: InquiryTemplate;
}

export const createInquiryTemplateAPI = (body: InquiryTemplateBody, token: string) => {
  return instance.post<InquiryTemplateBody, AxiosResponse<InquiryTemplateRes>>(
    "/api/inquiry-templates",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export interface InquiryTemplatePreviewRes {
  code: number;
  message: string;
  data: {
    rendered: string;
    unresolved: string[];
    placeholders: string[];
  };
}

// inquiryId is optional — without one the tokens resolve to blanks, which still
// shows the shape of the reply. Pass one when previewing from inside an open inquiry.
export const previewInquiryTemplateAPI = (
  content: string,
  inquiryId: number | undefined,
  token: string
) => {
  return instance.post<undefined, AxiosResponse<InquiryTemplatePreviewRes>>(
    "/api/inquiry-templates/preview",
    { content, inquiryId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
