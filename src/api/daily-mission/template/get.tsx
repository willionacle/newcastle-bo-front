import useUserStore from "@/store/user.store";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import instance from "@/api/axios";
import { SWRType } from "@/api/types";

export const TEMPLATE_LIST_KEY = `/api/daily-mission-group-template`;
export const TEMPLATE_ACTIVE_NAMES_KEY = `/api/daily-mission-group-template/active-names`;

export interface DailyMissionGroupTemplateName {
  id: number;
  name: string;
}

export interface DailyMissionGroupingItem {
  id: number;
  groupId: number;
  itemId: number;
  itemName: string;
  itemType: string; // 'mission' | 'coupon'
  missionType: string | null;
  functionName: string | null;
  itemAmount: string; // decimal string
  itemPercentage: string; // decimal string
  itemOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Row of GET /api/daily-mission-group-template.
 * The backend handoff only documents `itemCount`; the remaining field names are
 * assumed camelCase (like the other template endpoints) and normalised below so
 * a snake_case response still renders.
 */
export interface DailyMissionGroupTemplate {
  id: number;
  name: string;
  isActive: boolean;
  itemCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

type RawTemplate = Partial<DailyMissionGroupTemplate> & Record<string, unknown>;

const normalizeTemplate = (raw: RawTemplate): DailyMissionGroupTemplate => {
  const active = raw.isActive ?? raw.is_active ?? raw.active;
  const count = raw.itemCount ?? raw.item_count ?? 0;
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    isActive: active === true || active === 1 || active === "1" || active === "true",
    itemCount: Number(count) || 0,
    createdAt: (raw.createdAt ?? raw.created_at ?? null) as string | null,
    updatedAt: (raw.updatedAt ?? raw.updated_at ?? null) as string | null,
  };
};

export const getDailyMissionGroupTemplateActiveNamesAPI = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<DailyMissionGroupTemplateName[]>>>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const swr = useSWR(TEMPLATE_ACTIVE_NAMES_KEY, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return { swr };
};

export const getDailyMissionGroupingsTemplate = async (groupId: number) => {
  const { token } = useUserStore.getState();
  const res = await instance.get<undefined, AxiosResponse<SWRType<DailyMissionGroupingItem[]>>>(
    `/api/daily-mission-groupings-template?groupId=${groupId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getDailyMissionGroupTemplateListAPI = () => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<undefined, AxiosResponse<SWRType<RawTemplate[] | null>>>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = res.data;
    const rows = Array.isArray(body?.data) ? body.data.map(normalizeTemplate) : [];
    return { ...body, data: rows } as SWRType<DailyMissionGroupTemplate[]>;
  };

  const swr = useSWR(TEMPLATE_LIST_KEY, fetcher);
  return { swr };
};
