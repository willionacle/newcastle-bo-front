import instance from "../axios";
import { AxiosResponse } from "axios";
import { InquiryTemplateBody, InquiryTemplateRes } from "./post";

// PUT is partial on purpose — send only the fields that changed. Saving the
// isActive toggle from a list row must never blank out title/content.
export type InquiryTemplateUpdateBody = Partial<InquiryTemplateBody>;

export const updateInquiryTemplateAPI = (
  id: number,
  body: InquiryTemplateUpdateBody,
  token: string
) => {
  return instance.put<InquiryTemplateUpdateBody, AxiosResponse<InquiryTemplateRes>>(
    `/api/inquiry-templates/${id}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
