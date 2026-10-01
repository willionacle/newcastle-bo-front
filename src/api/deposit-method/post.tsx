import instance from "../axios";
import useUserStore from "@/store/user.store";

export interface CreateDepositMethodParams {
  type: string;
  title: string;
  displayName: string;
  status?: number;
  isInput?: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  memo?: string;
  showMemo?: number;
}

export interface UpdateDepositMethodParams {
  id: number;
  type?: string;
  title?: string;
  status?: number;
  displayName?: string;
  isInput?: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  memo?: string;
  showMemo?: number;
  syncToAccountsBankInfo?: boolean;
  syncToAccountsStatus?: boolean;
}

export interface TransferInUseParams {
  sourceType: string;
  targetType: string;
  dryRun?: boolean;
}

export interface DepositMethodResponse {
  code: number;
  message: string;
  data?: any;
}

export interface DeleteDepositMethodResponse {
  code: number;
  message: string;
  data?: {
    success: boolean;
    deletedMethod: {
      id: number;
      type: string;
    };
    message: string;
  };
}

export interface UpdateBatchTypeDepositMethod {
  current_type: string;
  batch_updates:{username:string;deposit_method: string | undefined}[]
}

export const createDepositMethod = async (params: CreateDepositMethodParams): Promise<DepositMethodResponse> => {
  const { token } = useUserStore.getState();

  const response = await instance.post<CreateDepositMethodParams, { data: DepositMethodResponse }>(
    '/api/deposit-methods',
    {
      ...params,
      status: params.status ?? 1,
      isInput: params.isInput ?? 0,
    },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return response.data;
};

export const updateDepositMethod = async (params: UpdateDepositMethodParams): Promise<DepositMethodResponse> => {
  const { token } = useUserStore.getState();
  const { id, ...updateData } = params;

  const response = await instance.put<Omit<UpdateDepositMethodParams, 'id'>, { data: DepositMethodResponse }>(
    `/api/deposit-methods/${id}`,
    updateData,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return response.data;
};

export const transferInUseBetweenTypes = async (params: TransferInUseParams): Promise<DepositMethodResponse> => {
  const { token } = useUserStore.getState();

  const response = await instance.post<TransferInUseParams, { data: DepositMethodResponse }>(
    '/api/deposit-methods/transfer-in-use',
    params,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return response.data;
};

export const deleteDepositMethod = async (id: number): Promise<DeleteDepositMethodResponse> => {
  const { token } = useUserStore.getState();

  const response = await instance.delete<undefined, { data: DeleteDepositMethodResponse }>(
    `/api/deposit-methods/${id}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return response.data;
};

export const updateBatchTypeDepositMethod = async (params: UpdateBatchTypeDepositMethod): Promise<DepositMethodResponse> => {
  const { token } = useUserStore.getState();
  const { ...updateData } = params;

  const response = await instance.post<UpdateBatchTypeDepositMethod, { data: DepositMethodResponse }>(
    `/api/deposit-methods/batch-type-update`,
    updateData,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return response.data;
};

