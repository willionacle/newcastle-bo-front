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

// ── 입금방법 타입별 일괄 ON/OFF ─────────────────────────────
// 공통 규칙: code === 0 이면 요청 자체는 성공. success 는 "실제로 바뀐 계정이 있는지"일 뿐이라
// 바뀔 게 없으면 code 0 + success false + message 로 내려온다 (에러가 아니라 안내로 노출).
// 알 수 없는 type 은 code 1.
export interface DepositAccountsByTypeResultData {
  type: string;
  inUse: 0 | 1;
  requestedCount?: number;
  createdCount?: number;
  notFoundCount?: number;
}

export interface DepositAccountsByTypeResponse {
  code: number;
  success: boolean;
  totalUpdated?: number;
  data?: DepositAccountsByTypeResultData;
  message: string;
}

export const DEPOSIT_ACCOUNT_BULK_MAX_USERNAMES = 10000;

/** 해당 타입의 모든 회원 입금계정을 비활성화 (in_use = 0). */
export const disableDepositAccountsByTypeAPI = async (type: string) => {
  const token = useUserStore.getState().token;
  return await instance.put<undefined, AxiosResponse<DepositAccountsByTypeResponse>>(
    `/api/deposit-accounts/type/${encodeURIComponent(type)}/disable`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/** 지정한 회원들의 해당 타입 입금계정을 활성화 (in_use = 1). 최대 10,000명. */
export const enableDepositAccountsByTypeAPI = async (type: string, usernames: string[]) => {
  const token = useUserStore.getState().token;
  return await instance.put<undefined, AxiosResponse<DepositAccountsByTypeResponse>>(
    `/api/deposit-accounts/type/${encodeURIComponent(type)}/enable`,
    { usernames },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/** 지정한 회원들의 해당 타입 입금계정을 비활성화 (in_use = 0). 최대 10,000명. */
export const disableDepositAccountsByTypeUsersAPI = async (
  type: string,
  usernames: string[]
) => {
  const token = useUserStore.getState().token;
  return await instance.put<undefined, AxiosResponse<DepositAccountsByTypeResponse>>(
    `/api/deposit-accounts/type/${encodeURIComponent(type)}/users/disable`,
    { usernames },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
