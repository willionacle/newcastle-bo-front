import useUserStore from "@/store/user.store";
import instance from "@/api/axios";
import { AxiosResponse } from "axios";
import { mutate } from "swr";
import { TEMPLATE_ACTIVE_NAMES_KEY, TEMPLATE_LIST_KEY } from "./get";

export interface TemplateEnvelope<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

export interface DailyMissionGroupTemplateItemBody {
  itemId?: number;
  itemName: string;
  itemType: string;
  itemAmount?: number | string;
  itemPercentage?: number | string;
  itemOrder?: number;
}

export type CreateDailyMissionGroupTemplateBody =
  | { name: string; fromGroupId: number }
  | { name: string; items: DailyMissionGroupTemplateItemBody[] };

export interface UpdateDailyMissionGroupTemplateBody {
  name?: string;
  isActive?: boolean;
}

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${useUserStore.getState().token}` },
  silent: true,
});

/** Revalidate the management list and the dropdown in the group form. */
const refreshTemplates = () => {
  mutate(TEMPLATE_LIST_KEY);
  mutate(TEMPLATE_ACTIVE_NAMES_KEY);
};

export const createDailyMissionGroupTemplateAPI = async (body: CreateDailyMissionGroupTemplateBody) => {
  const res = await instance.post<CreateDailyMissionGroupTemplateBody, AxiosResponse<TemplateEnvelope>>(
    TEMPLATE_LIST_KEY,
    body,
    authHeaders()
  );
  if (res.data?.code === 0) refreshTemplates();
  return res.data;
};

export const updateDailyMissionGroupTemplateAPI = async (id: number, body: UpdateDailyMissionGroupTemplateBody) => {
  const res = await instance.patch<UpdateDailyMissionGroupTemplateBody, AxiosResponse<TemplateEnvelope>>(
    `${TEMPLATE_LIST_KEY}/${id}`,
    body,
    authHeaders()
  );
  if (res.data?.code === 0) refreshTemplates();
  return res.data;
};

export const deleteDailyMissionGroupTemplateAPI = async (id: number) => {
  const res = await instance.delete<undefined, AxiosResponse<TemplateEnvelope>>(
    `${TEMPLATE_LIST_KEY}/${id}`,
    authHeaders()
  );
  if (res.data?.code === 0) refreshTemplates();
  return res.data;
};

/** Pull a readable message out of an axios error (HTTP 4xx/5xx with an envelope body). */
export const templateErrorMessage = (error: unknown, fallback: string) => {
  const e = error as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message || fallback;
};
