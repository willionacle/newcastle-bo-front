import instance from "../axios";
import { AxiosResponse } from "axios";
import { InquiryCategory } from "./get";

export type InquiryCategoryGroup = "general" | "account";

export interface InquiryCategoryOption {
  key: InquiryCategory;
  labelKo: string;
  group: InquiryCategoryGroup;
}

export interface InquiryCategoriesRes {
  code: number;
  message: string;
  data: {
    categories: InquiryCategoryOption[];
  };
}

// Admin categories endpoint requires ADMIN auth (unlike the player-side public one).
export const inquiryCategoriesAPI = (token: string) => {
  return instance.get<undefined, AxiosResponse<InquiryCategoriesRes>>(
    "/api/inquiries/categories",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
