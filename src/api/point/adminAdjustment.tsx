import useUserStore from "@/store/user.store";
import { Strapi } from "../types/strapi";
import instance from "../axios";
import { mutate } from "swr";

export interface AdminAdjustmentData {
  userid: number;
  username?: string;
  admin_id?: string;
  amount: number;
  system_note: string;
}

export const adjustBalance = async (
  body: AdminAdjustmentData,
  id: Strapi["id"] | undefined
) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<AdminAdjustmentData, any>(
    "/adddeductbalance",
    {...body},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res) {
    mutate(`/getuser?id=${id}`);
  }

  return res.data;
};

export const adjustRolling = async (
  body: AdminAdjustmentData,
  id: Strapi["id"] | undefined
) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<AdminAdjustmentData, any>(
    "/adddeductrolling",
    {...body},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res) {
    mutate(`/custom/users/${id}`);
  }

  return res.data;
};

export const adjustLossing = async (
  body: AdminAdjustmentData,
  id: Strapi["id"] | undefined
) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<AdminAdjustmentData, any>(
    "/adddeductpayback",
    {...body},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res) {
    mutate(`/getuser?id=${id}`);
  }

  return res.data;
};

export const adjustMileage = async (
  body: AdminAdjustmentData,
  id: Strapi["id"] | undefined
) => {
  const token = useUserStore.getState().token;

  const res = await instance.post<AdminAdjustmentData, any>(
    "/point/adjust-mileage",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res) {
    mutate(`/getuser?id=${id}`);
  }

  return res.data;
};
