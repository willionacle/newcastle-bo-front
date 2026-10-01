import instance from "../axios";
import { AxiosResponse } from "axios";

export interface InquiryTemplateDeleteRes {
  code: number;
  message: string;
}

export const deleteInquiryTemplateAPI = (id: number, token: string) => {
  return instance.delete<undefined, AxiosResponse<InquiryTemplateDeleteRes>>(
    `/api/inquiry-templates/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
