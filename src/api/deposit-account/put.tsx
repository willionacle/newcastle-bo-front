import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";

export interface UpdateDepositAccountBody {
  type?: string;
  title?: string;
  bank_name?: string | null;
  account_number?: string | null;
  account_name?: string | null;
  inUse?: 0 | 1;
}

export interface UpdateDepositAccountResponse {
  code: number;
  data: {
    id: number;
    username: string;
    type: string;
    title: string;
    bank_name: string | null;
    account_number: string | null;
    account_name: string | null;
    in_use: 0 | 1;
    created_at: string;
    updated_at: string;
  };
  message: string;
}

// Bulk update interfaces
export interface BulkUpdateData {
  type?: string;
  title?: string;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  inUse?: 0 | 1;
}

export interface BulkUpdateItem {
  id: number;
  data: BulkUpdateData;
}

export interface BulkUpdateRequest {
  updates: BulkUpdateItem[];
}

export interface BulkUpdateAccountInfo {
  id: number;
  username: string;
  type: string;
  title: string;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  inUse: 0 | 1;
  isInput: 0 | 1;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BulkUpdateResponse {
  code: number;
  success: boolean;
  updated: number[];
  failed: Array<{
    id: number;
    error: string;
  }>;
  totalUpdated: number;
  data: BulkUpdateAccountInfo[];
  message: string;
}

export const updateDepositAccoutsAPI = async (id: number, body: UpdateDepositAccountBody) => {
  const token = useUserStore.getState().token;

  return await instance.put<undefined, AxiosResponse<UpdateDepositAccountResponse>>(
    `/api/deposit-accounts/account/${id}`,
    body,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateDepositAccountsBulkAPI = async (username: string, body: BulkUpdateRequest) => {
  const token = useUserStore.getState().token;

  return await instance.put<undefined, AxiosResponse<BulkUpdateResponse>>(
    `/api/deposit-accounts/user/${username}/bulk`,
    body,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const createDepositAccoutsAPI = async (body: any) => {
  const token = useUserStore.getState().token;

  return await instance.post(
    `/adddepositaccount/`,
    { ...body },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
