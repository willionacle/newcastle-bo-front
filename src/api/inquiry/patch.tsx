import instance from "../axios";
import { AxiosResponse } from "axios";
import { InquiryItem, InquiryStatus } from "./get";

export interface InquiryPatchRes {
  code: number;
  message: string;
  data: InquiryItem;
}

export const answerInquiryAPI = (
  id: number,
  answer: string,
  token: string,
  templateId?: number
) => {
  return instance.patch<undefined, AxiosResponse<InquiryPatchRes>>(
    `/api/inquiries/${id}/answer`,
    // templateId is only a record of which canned reply was used — the server
    // never re-renders from the template, so it never affects what's sent as `answer`.
    { answer, ...(templateId !== undefined ? { templateId } : {}) },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateInquiryStatusAPI = (
  id: number,
  status: InquiryStatus,
  token: string
) => {
  return instance.patch<undefined, AxiosResponse<InquiryPatchRes>>(
    `/api/inquiries/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
