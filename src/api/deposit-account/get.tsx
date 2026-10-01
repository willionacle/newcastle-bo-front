import useUserStore from "@/store/user.store";
import instance from "../axios";
import { stringify } from "qs";
import { AxiosResponse } from "axios";
import { SWRType } from "../types";

export interface DepositAccInUse {
  v_account1_default: number;
  v_account2_default: number;
}

export interface DepositAccount {
  id: number;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  type: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  createdById: number | null;
  updatedById: number | null;
  inUse: boolean;
  title: string;
  displayName: string | null;
  isInput: number;
}

export interface DepositAccountResponse {
  code: number;
  data: DepositAccount[];
  synced: boolean;
  message: string;
}

export const depositAccountAPI = async (username: string | undefined) => {
  if (!username) return null;
  
  const { token } = useUserStore.getState();
  
  try {
    const res = await instance.get<undefined, AxiosResponse<DepositAccountResponse>>(
      `/api/deposit-accounts/user/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return res.data;
  } catch (error) {
    console.error('Failed to fetch deposit accounts:', error);
    return null;
  }
};

export const getDepositAccountInUse = async () => {
  const { token, userid } = useUserStore.getState();
  
  const query = stringify({
    userid: userid
  });
  
  try {
    const res = await instance.get<undefined, AxiosResponse<SWRType<DepositAccInUse[]>>>(
      `/depositgetinuse?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return res.data;
  } catch (error) {
    console.error('Failed to fetch deposit account in use:', error);
    return null;
  }
};
